const { MessageReceiver } = require('ffc-messaging')
const processCertificateIssueRequest = require('./inbound/certificates/process-certificate-request')
const { certificateRequestQueue } = require('../config').messageQueueConfig

let certificateRequestReceiver

const start = async () => {
  /* istanbul ignore next */
  const certificateIssueAction = message => processCertificateIssueRequest(message, certificateRequestReceiver)
  certificateRequestReceiver = new MessageReceiver(certificateRequestQueue, certificateIssueAction)
  await certificateRequestReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await certificateRequestReceiver.closeConnection()
}

module.exports = { start, stop }
