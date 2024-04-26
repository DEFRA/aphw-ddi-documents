describe('SendEvent test', () => {
  jest.mock('ffc-messaging')
  const { MessageSender } = require('ffc-messaging')

  const { sendEvent } = require('../../../app/messaging/outbound/send-event')

  beforeEach(() => {
    jest.clearAllMocks()
    MessageSender.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('sendEvent', () => {
    test('should send event as valid schema', async () => {
      const mockSend = jest.fn()
      MessageSender.mockImplementation(() => { return { sendMessage: mockSend, closeConnection: jest.fn() } })

      await sendEvent({
        data: {
          message: '{"actioningUser":{"username":"hal-9000","displayname":"Hal 9000"},"operation":"certificate issued","details":{"dog":{"indexNumber":"ED123","name":"Rex"}}}'
        },
        id: 'some-guid',
        partitionKey: 'ED123',
        source: 'aphw-ddi-documents',
        subject: 'DDI Certificate Issued',
        type: 'uk.gov.defra.ddi.event.certificate.issued'
      })

      expect(mockSend).toHaveBeenCalledTimes(1)
    })

    test('should throw when invalid schema', async () => {
      const mockSend = jest.fn()
      MessageSender.mockImplementation(() => { return { sendMessage: mockSend, closeConnection: jest.fn() } })

      await expect(sendEvent({
        data: {
          message: ''
        },
        id: 'some-guid',
        type: 'uk.gov.defra.ddi.event.certificate.issued'
      })).rejects.toThrow('Invalid event: unable to send')
    })
  })
})
