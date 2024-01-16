describe('certificate generator', () => {
  const { generateCertificate } = require('../../../app/lib/generator/certificate')
  const template = require('../../mocks/messaging/template')
  const { valid } = require('../../mocks/messaging/certificate-request')

  test('should generate pdf', async () => {
    const cert = await generateCertificate(template, valid.body)

    expect(cert).toEqual(expect.any(Buffer))
  })
})
