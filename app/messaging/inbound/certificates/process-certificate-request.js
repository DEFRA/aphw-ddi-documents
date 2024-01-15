const util = require('util')

const { generateCertificate } = require('../../../lib/generator/certificate')
const { uploadCertificate } = require('../../../lib/storage/repos/certificate')
const { validateCertificateRequest } = require('./certificate-request-schema')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const { body } = validateCertificateRequest(message.body)

    console.log('Received DDI certificate issue request: ', util.inspect(message.body, false, null, true))

    const cert = await generateCertificate(body)
    await uploadCertificate(body.dog.indexNumber, cert)

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to DDI certificate issue request: ', err.message)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processCertificateIssueRequest
