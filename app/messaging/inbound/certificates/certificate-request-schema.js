const Joi = require('joi')

const schema = Joi.object({
  exemptionOrder: Joi.number().allow(2023, 2015).required(),
  data: Joi.object({
    owner: Joi.object({
      name: Joi.string().required(),
      address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string().optional().default(''),
        line3: Joi.string().default(''),
        postcode: Joi.string().required(),
      }).required(),
    }).required(),
    dog: Joi.object({
      indexNumber: Joi.string().required(),
      microchipNumber: Joi.string().required(),
      breed: Joi.string().required(),
      sex: Joi.string().allow('Male', 'Female').required(),
      birthDate: Joi.string().required(),
      colour: Joi.string().required(),
      certificateIssued: Joi.date().iso().optional().default(new Date())
    }).required()
  }).required()
})

const validateCertificateRequest = (request) => {
  const { value, error } = schema.validate(request)

  if (error) {
    throw new Error(`Certificate request validation error: ${error.message}`)
  }

  return value
}

module.exports = { validateCertificateRequest }
