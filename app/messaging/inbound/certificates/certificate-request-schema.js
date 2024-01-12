const joi = require('joi')

const schema = joi.object({
  exemptionOrder: joi.number.allow([2023, 2015]).required(),
  data: joi.object({
    owner: joi.object({
      name: joi.string().required(),
      address: joi.object({
        line1: joi.string().required(),
        line2: joi.string().optional().default(''),
        line3: joi.string().default(''),
        postcode: joi.string().required(),
      }),
      indexNumber: joi.string().required(),
      microchipNumber: joi.string().required(),
      breed: joi.string().required(),
      sex: joi.string().allow(['Male', 'Female']).required(),
      dateOfBirth: joi.string().required(),
      colour: joi.string().required(),
      certificateIssued: joi.date().iso().optional().default(new Date())
    }).required()
  })
})

const validateCertificateRequest = (request) => {
  const { value, error } = schema.validate(request)

  if (error) {
    throw new Error(`Certificate request validation error: ${error.message}`)
  }

  return value
}

module.exports = { validateCertificateRequest }
