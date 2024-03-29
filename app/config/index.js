const Joi = require('joi')
const messageQueueConfig = require('./message-queue')
const notifyConfig = require('./notify')
const storageConfig = require('./storage')

const schema = Joi.object({
  port: Joi.number().default(3005),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  isDev: Joi.boolean().default(false)
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development'
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.messageQueueConfig = messageQueueConfig
value.notifyConfig = notifyConfig
value.storageConfig = storageConfig

module.exports = value
