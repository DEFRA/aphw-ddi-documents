const generateDocument = require('../../../lib/document')
const { valdateCertificateRequest } = require('./certificate-request-schema')

const processCertificateIssueRequest = async (message, receiver) => {
  try {
    const messageBody = valdateCertificateRequest(message.body)

    console.log('Received DDI certificate issue request', JSON.stringify(messageBody))

    await generateDocument(messageBody)

    await receiver.completeMessage(message)
  } catch (err) {
    await receiver.deadLetterMessage(message)
    console.error('Unable to DDI certificate issue request:', err.message)
  }
}

module.exports = processCertificateIssueRequest
