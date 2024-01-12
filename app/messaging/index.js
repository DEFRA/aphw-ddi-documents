const { MessageReceiver } = require('ffc-messaging')
const processCertificateIssueRequest = require('./inbound/certificates/process-certificate-request')
const { certificateRequestQueue } = require('../config').messageQueueConfig

let certificateRequestReceiver

const start = async () => {
  const certificateIssueAction = message => processCertificateIssueRequest(message)
  certificateRequestReceiver = new MessageReceiver(certificateRequestQueue, certificateIssueAction)
  await certificateRequestReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await documentGenerationReceiver.closeConnection()
  await certificateRequestReceiver.closeConnection()
}

module.exports = { start, stop }
