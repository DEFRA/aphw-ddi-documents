const { storageConfig } = require('../../../config')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadFile } = require('../../../lib/storage/repos/uploading')
const { validateCertificateRequest } = require('./certificate-request-schema')
const { getCertificateTemplate } = require('../../../lib/storage/repos/certificate-template')
const { sendCertificateIssuedToAudit, sendDownloadToAudit } = require('../../outbound/send-audit')
const { DOWNLOAD_REQUESTED } = require('../../../constants/events')
const { extendData } = require('../../../lib/generator/extend-data')

const constructDebug = (message) => {
  return {
    certificateId: message.body.certificateId,
    indexNumber: message.body.dog.indexNumber,
    type: message.applicationProperties?.type
  }
}

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const data = validateCertificateRequest(message.body)

    console.log('Received DDI document request: ', constructDebug(message))

    console.time('Document generation')

    const templateKey = `${data.exemptionOrder}${data.owner?.organisationName ? '_with_org' : ''}`
    const templateName = message.applicationProperties?.type === DOWNLOAD_REQUESTED ? 'police-download' : templateKey

    const template = await getCertificateTemplate(templateName)

    console.log(`Got template with name ${templateName}`)

    const extendedData = extendData(templateName, data)

    const cert = await generateCertificate(template, extendedData)

    console.timeEnd('Document generation')
    console.time('Document upload')

    await uploadFile(storageConfig.certificateContainer, data.dog.indexNumber, data.certificateId, cert)

    console.timeEnd('Document upload')

    if (message.applicationProperties?.type === DOWNLOAD_REQUESTED) {
      await sendDownloadToAudit(data)
    } else {
      await sendCertificateIssuedToAudit(data)
    }

    await receiver.completeMessage(message)
  } catch (err) {
    console.log('Unable to process DDI document request: ', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
