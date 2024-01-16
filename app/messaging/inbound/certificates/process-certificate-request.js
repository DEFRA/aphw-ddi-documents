const util = require('util')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadCertificate } = require('../../../lib/storage/repos/certificate')
const { validateCertificateRequest } = require('./certificate-request-schema')
const { getCertificateTemplate } = require('../../../lib/storage/repos/certificate-template')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const { data } = validateCertificateRequest(message.body)

    console.log('Received DDI certificate issue request: ', util.inspect(message.body, false, null, true))

    const template = await getCertificateTemplate(data.exemptionOrder)
    const cert = await generateCertificate(template, data)
    await uploadCertificate(data.dog.indexNumber, data.certificateId, cert)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process DDI certificate issue request: ', err.message)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
