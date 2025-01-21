const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string(),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const schema = Joi.object({
  certificateRequestQueue: {
    address: Joi.string(),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  eventsTopic: {
    address: Joi.string(),
    ...sharedConfigSchema
  },
  managedIdentityClientId: Joi.string().optional()
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.MESSAGE_QUEUE_HOST,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  username: process.env.MESSAGE_QUEUE_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const config = {
  certificateRequestQueue: {
    address: process.env.CERTIFICATE_REQUEST_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  eventsTopic: {
    address: process.env.EVENTS_TOPIC_ADDRESS,
    ...sharedConfig
  },
  managedIdentityClientId: process.env.AZURE_CLIENT_ID
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The message queue config is invalid. ${error.message}`)
}

module.exports = value
