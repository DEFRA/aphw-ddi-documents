const Joi = require('joi')
const { CERTIFICATE_REQUESTED } = require('../../../constants/events')

const schema = Joi.object({
  body: Joi.object({
    exemptionOrder: Joi.number().allow(2023, 2015).required(),
    certificateId: Joi.string().uuid().required(),
    owner: Joi.object({
      name: Joi.string().required(),
      address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string().optional().default(''),
        line3: Joi.string().optional().default(''),
        postcode: Joi.string().required()
      }).required()
    }).required(),
    dog: Joi.object({
      indexNumber: Joi.string().required(),
      microchipNumber: Joi.string().required(),
      name: Joi.string().required(),
      breed: Joi.string().required(),
      sex: Joi.string().allow('Male', 'Female').required(),
      birthDate: Joi.date().iso().required(),
      colour: Joi.string().required(),
      certificateIssued: Joi.date().iso().optional().default(new Date())
    }).required()
  }).required(),
  type: Joi.string().required().allow(CERTIFICATE_REQUESTED),
  source: Joi.string().required()
})

const validateCertificateRequest = (request) => {
  const { value, error } = schema.validate(request, { abortEarly: false })

  if (error) {
    throw new Error(`Certificate request validation error: ${error.message}`)
  }

  return value
}

module.exports = { validateCertificateRequest }
