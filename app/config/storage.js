const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  certificateContainer: Joi.string().default('certificates'),
  certificateTemplateContainer: Joi.string().default('certificate-templates'),
  attachmentsContainer: Joi.string().default('attachments'),
  useConnectionString: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(true),
  managedIdentityClientId: Joi.string().optional()
})

// Build config
const config = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  certificateContainer: process.env.AZURE_STORAGE_CERTIFICATE_CONTAINER,
  certificateTemplateContainer: process.env.AZURE_STORAGE_CERTIFICATE_TEMPLATE_CONTAINER,
  attachmentsContainer: process.env.AZURE_STORAGE_ATTACHMENTS_CONTAINER,
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS,
  managedIdentityClientId: process.env.AZURE_CLIENT_ID
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
