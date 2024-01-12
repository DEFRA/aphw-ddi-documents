const { MessageReceiver } = require('ffc-messaging')
const processDocumentRequest = require('./inbound/documents/process-document-request')
const processCertificateIssueRequest = require('./inbound/certificates/process-certificate-request')
const { applicationdDocCreationRequestQueue, certificateIssueRequestQueue } = require('../config').messageQueueConfig

let documentGenerationReceiver
let certificateIssueRequestReceiver

const start = async () => {
  const documentGenerationAction = message => processDocumentRequest(message, documentGenerationReceiver)
  documentGenerationReceiver = new MessageReceiver(applicationdDocCreationRequestQueue, documentGenerationAction)
  await documentGenerationReceiver.subscribe()

  const certificateIssueAction = message => processCertificateIssueRequest(message)
  certificateIssueRequestReceiver = new MessageReceiver(certificateIssueRequestQueue, certificateIssueAction)
  await certificateIssueRequestReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await documentGenerationReceiver.closeConnection()
  await certificateIssueRequestReceiver.closeConnection()
}

module.exports = { start, stop }
