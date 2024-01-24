const util = require('util')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadCertificate } = require('../../../lib/storage/repos/certificate')
const { validateCertificateRequest } = require('./certificate-request-schema')
const { getCertificateTemplate } = require('../../../lib/storage/repos/certificate-template')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const data = validateCertificateRequest(message.body)

    console.log('Received DDI certificate issue request: ', util.inspect(message.body, false, null, true))

    const template = await getCertificateTemplate(data.exemptionOrder)

    console.log('Got certificate template', template?.definition?.length)

    const cert = await generateCertificate(template, data)

    console.log('Generated certificate', cert.length)

    await uploadCertificate(data.dog.indexNumber, data.certificateId, cert)

    console.log('Uploaded certificate')

    await receiver.completeMessage(message)
  } catch (err) {
    console.log('Unable to process DDI certificate issue request: ', err.message)
    console.error('Unable to process DDI certificate issue request: ', err.message)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
