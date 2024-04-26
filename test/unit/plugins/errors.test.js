describe('Errors test', () => {
  const createServer = require('../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('Traps error when invalid url', async () => {
    const options = {
      method: 'GET',
      url: '/invalid'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    await server.stop()
  })
})
