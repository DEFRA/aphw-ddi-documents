const Joi = require('joi')

const schema = Joi.object({
  exemptionOrder: Joi.number().allow(2023, 2015).required(),
  user: Joi.object({
    username: Joi.string().required(),
    displayname: Joi.string().required(),
    userId: Joi.string().optional().allow(null).allow('')
  }).required(),
  certificateId: Joi.string().uuid().required(),
  owner: Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
      line1: Joi.string().required(),
      line2: Joi.string().optional().allow(null).allow('').default(''),
      line3: Joi.string().optional().allow(null).allow('').default(''),
      postcode: Joi.string().required()
    }).required(),
    organisationName: Joi.string().optional().allow(null).allow('')
  }).required(),
  dog: Joi.object({
    indexNumber: Joi.string().required(),
    microchipNumber: Joi.string().optional().allow(null).allow('').default(''),
    name: Joi.string().optional().allow(null).allow('').default(''),
    breed: Joi.string().required(),
    sex: Joi.string().optional().allow(null).allow('').default(''),
    birthDate: Joi.date().iso().optional().allow(null).allow('').default(''),
    colour: Joi.string().optional().allow(null).allow('').default(''),
    certificateIssued: Joi.date().iso().optional()
  }).required()
})

const validateCertificateRequest = (request) => {
  const { value, error } = schema.validate(request, { abortEarly: false })

  if (error) {
    throw new Error(`Certificate request validation error: ${error.message}`)
  }

  return value
}

module.exports = { validateCertificateRequest }
