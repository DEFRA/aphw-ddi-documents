const Joi = require('joi')

const schema = Joi.object({
  carbonCopyEmailAddress: Joi.string().email().allow(null, ''),
  notifyApiKey: Joi.string(),
  notfiyCheckInterval: Joi.number().default(30000),
  templateIdCertificateGeneration: Joi.string().uuid()
})

const config = {
  carbonCopyEmailAddress: process.env.CARBON_COPY_EMAIL_ADDRESS,
  notifyApiKey: process.env.NOTIFY_API_KEY,
  notfiyCheckInterval: process.env.NOTIFY_CHECK_INTERVAL,
  templateIdCertificateGeneration: process.env.NOTIFY_TEMPLATE_ID_CERTIFICATE_COMPLETE
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The notify config is invalid. ${error.message}`)
}

module.exports = value
