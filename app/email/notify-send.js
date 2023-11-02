const notifyClient = require('./notify-client')
const createFileName = require('../document/create-filename')
const { downloadBlob } = require('../storage')
const { templateIdCertificateGeneration, carbonCopyEmailAddress } = require('../config').notifyConfig

const send = async (templateId, email, personalisation) => {
  console.log(`Received email to send to ${email} for ${personalisation.reference}`)
  return notifyClient.sendEmail(
    templateId,
    email,
    personalisation
  )
}

const sendEmail = async (email, personalisation, reference, templateId) => {
  let success = true
  try {
    await send(templateId, email, { personalisation, reference })
    console.log(`Email sent to ${email} for ${reference}`)
    await sendCarbonCopy(templateId, { personalisation, reference })
  } catch (e) {
    success = false
    console.error(`Error occurred sending email to ${email} for ${reference}. Error: ${JSON.stringify(e.response?.data)}`)
  }
  return success
}

const sendCarbonCopy = async (templateId, personalisation) => {
  if (carbonCopyEmailAddress) {
    await send(
      templateId,
      carbonCopyEmailAddress,
      personalisation
    )

    console.log(`Carbon copy email sent to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
  }
}

const sendCertificateEmail = async (data) => {
  const contents = await downloadBlob(createFileName(data))
  const personalisation = { name: data.name, reference: data.reference, link_to_file: notifyClient.prepareUpload(contents) }
  return sendEmail(data.email, personalisation, data.reference, templateIdCertificateGeneration)
}

module.exports = {
  sendCertificateEmail
}
