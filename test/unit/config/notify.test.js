describe('notify config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if NOTIFY_TEMPLATE_ID_CERTIFICATE_COMPLETE is invalid value', () => {
    process.env.NOTIFY_TEMPLATE_ID_CERTIFICATE_COMPLETE = 'invalid-guid'
    expect(() => require('../../../app/config/notify.js')).toThrow('')
  })

  test('should pass validation if values are present', () => {
    process.env.NOTIFY_TEMPLATE_ID_CERTIFICATE_COMPLETE = 'd97fa49b-f742-46ee-9920-35ccb0196d3b'
    expect(() => require('../../../app/config/notify.js')).not.toThrow()
  })
})
