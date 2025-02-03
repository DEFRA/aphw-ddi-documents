describe('storage config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if MESSAGE_QUEUE_HOST is invalid value', () => {
    process.env.MESSAGE_QUEUE_HOST = undefined
    expect(() => require('../../../app/config/message-queue.js')).toThrow('')
  })

  test('should pass validation if values are present', () => {
    process.env.MESSAGE_QUEUE_HOST = 'queue-host'
    expect(() => require('../../../app/config/message-queue.js')).not.toThrow()
  })
})
