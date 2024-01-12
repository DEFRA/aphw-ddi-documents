const generateDocument = require('../../../lib/document')
const { sendCertificateEmail } = require('../../../email/notify-send')
const { validateDocumentRequest } = require('./document-request-schema')

const processDocumentRequest = async (message, receiver) => {
  try {
    const messageBody = message.body
    if (validateDocumentRequest(messageBody)) {
      console.log('Received document generation request', JSON.stringify(messageBody))
      await generateDocument(messageBody)
      await sendCertificateEmail(messageBody)
      await receiver.completeMessage(message)
    }
  } catch (err) {
    await receiver.deadLetterMessage(message)
    console.error('Unable to document generation request:', err.message)
  }
}

module.exports = processDocumentRequest
