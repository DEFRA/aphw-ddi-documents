const { v4: uuidv4 } = require('uuid')
const { CERTIFICATE_GENERATION_AUDIT, DOWNLOAD_GENERATION_AUDIT } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const { sendEvent } = require('./send-event')

const sendEventToAudit = async (eventType, eventSubject, eventDescription, actioningUser) => {
  if (!isUserValid(actioningUser)) {
    throw new Error(`Username and displayname are required for auditing of ${eventType}`)
  }

  const event = {
    type: eventType,
    source: SOURCE,
    id: uuidv4(),
    partitionKey: eventType,
    subject: eventSubject,
    data: {
      message: JSON.stringify({
        actioningUser,
        operation: eventDescription
      })
    }
  }

  await sendEvent(event)
}

const sendCertificateIssuedToAudit = async (data) => {
  if (!isUserValid(data?.user)) {
    throw new Error('Username and displayname are required for auditing certificate issued')
  }

  const messagePayload = constructCertificateIssuedPayload(data)
  const event = {
    type: CERTIFICATE_GENERATION_AUDIT,
    source: SOURCE,
    id: uuidv4(),
    partitionKey: determinePk(data, CERTIFICATE_GENERATION_AUDIT),
    subject: 'DDI Certificate Issued',
    data: {
      message: messagePayload
    }
  }

  await sendEvent(event)
}

const sendDownloadToAudit = async (data) => {
  if (!isUserValid(data?.user)) {
    throw new Error('Username and displayname are required for auditing certificate issued')
  }

  const messagePayload = constructDownloadIssuedPayload(data)
  const event = {
    type: DOWNLOAD_GENERATION_AUDIT,
    source: SOURCE,
    id: uuidv4(),
    partitionKey: data.dog.indexNumber,
    subject: 'enforcement user downloaded dog details',
    data: {
      message: messagePayload
    }
  }

  await sendEvent(event)
}

const isUserValid = (user) => {
  return user?.username && user?.username !== '' && user?.displayname && user?.displayname !== ''
}

const determinePk = (entity, eventType) => {
  if (eventType === CERTIFICATE_GENERATION_AUDIT) {
    return entity.dog.indexNumber
  }

  throw new Error(`Invalid object for audit event type: ${eventType}`)
}

const constructCertificateIssuedPayload = (data) => {
  const actioningUser = data.user
  delete data.user

  return JSON.stringify({
    actioningUser,
    operation: 'certificate issued',
    details: data
  })
}

const constructDownloadIssuedPayload = (data) => {
  const actioningUser = data.user
  delete data.user

  return JSON.stringify({
    actioningUser,
    details: { pk: data.dog.indexNumber }
  })
}

module.exports = {
  sendEventToAudit,
  sendCertificateIssuedToAudit,
  sendDownloadToAudit,
  isUserValid,
  determinePk
}
