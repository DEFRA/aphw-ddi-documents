const joi = require('joi')

const eventSchema = joi.object({
  reference: joi.string().required(),
  email: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional()
})

const validateDocumentRequest = (event) => {
  const validate = eventSchema.validate(event)

  if (validate.error) {
    console.log('Document request validation error', JSON.stringify(validate.error))
    return false
  }

  return true
}

module.exports = { validateDocumentRequest }
