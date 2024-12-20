const util = require('util')
const { storageConfig } = require('../../../config')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadFile } = require('../../../lib/storage/repos/uploading')
const { validateCertificateRequest } = require('./certificate-request-schema')
const { getCertificateTemplate } = require('../../../lib/storage/repos/certificate-template')
const { sendCertificateIssuedToAudit } = require('../../outbound/send-audit')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const data = validateCertificateRequest(message.body)

    console.log('Received DDI certificate issue request: ', util.inspect(message.body, false, null, true))

    const templateKey = `${data.exemptionOrder}${data.owner?.organisationName ? '_with_org' : ''}`

    const template = await getCertificateTemplate(templateKey)

    console.log(`Got certificate template with key ${templateKey}`)

    const cert = await generateCertificate(template, data)

    console.log('Generated certificate')

    await uploadFile(storageConfig.certificateContainer, data.dog.indexNumber, data.certificateId, cert)

    await sendCertificateIssuedToAudit(data)

    console.log('Uploaded certificate')

    await receiver.completeMessage(message)
  } catch (err) {
    console.log('Unable to process DDI certificate issue request: ', err.message)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
