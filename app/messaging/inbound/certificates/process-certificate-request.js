const util = require('util')
const { storageConfig } = require('../../../config')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadFile } = require('../../../lib/storage/repos/uploading')
const { validateCertificateRequest } = require('./certificate-request-schema')
const { getCertificateTemplate } = require('../../../lib/storage/repos/certificate-template')
const { sendCertificateIssuedToAudit, sendDownloadToAudit } = require('../../outbound/send-audit')
const { DOWNLOAD_REQUESTED } = require('../../../constants/events')
const { extendData } = require('../../../lib/generator/extend-data')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const data = validateCertificateRequest(message.body)

    console.log('Received DDI document request: ', util.inspect(message.body, false, null, true))

    const templateKey = `${data.exemptionOrder}${data.owner?.organisationName ? '_with_org' : ''}`
    const templateName = message.applicationProperties?.type === DOWNLOAD_REQUESTED ? 'police-download' : templateKey

    const template = await getCertificateTemplate(templateName)

    console.log(`Got template with name ${templateName}`)

    const extendedData = extendData(templateName, data)

    const cert = await generateCertificate(template, extendedData)

    console.log('Generated document')

    await uploadFile(storageConfig.certificateContainer, data.dog.indexNumber, data.certificateId, cert)

    if (message.applicationProperties?.type === DOWNLOAD_REQUESTED) {
      await sendDownloadToAudit(data)
    } else {
      await sendCertificateIssuedToAudit(data)
    }

    console.log('Uploaded document')

    await receiver.completeMessage(message)
  } catch (err) {
    console.log('Unable to process DDI document request: ', err.message)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
