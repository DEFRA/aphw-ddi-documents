const { CERTIFICATE_GENERATION_AUDIT } = require('../../../app/constants/events')
const { sendCertificateIssuedToAudit, sendEventToAudit, determinePk } = require('../../../app/messaging/outbound/send-audit')

jest.mock('../../../app/messaging/outbound/send-event')
const { sendEvent } = require('../../../app/messaging/outbound/send-event')

const validUser = { username: 'hal-9000', displayname: 'Hal 9000' }

describe('SendAudit test', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('sendEventToAudit', () => {
    test('should send event to audit', async () => {
      await sendEventToAudit(CERTIFICATE_GENERATION_AUDIT, 'DDI Certificate Issued', 'issued cert', validUser)
      expect(sendEvent).toBeCalledWith({
        type: CERTIFICATE_GENERATION_AUDIT,
        source: 'aphw-ddi-documents',
        id: expect.any(String),
        partitionKey: 'uk.gov.defra.ddi.event.certificate.issued',
        subject: 'DDI Certificate Issued',
        data: {
          message: JSON.stringify({
            actioningUser: validUser,
            operation: 'issued cert'
          })
        }

      })
    })

    test('should fail given no user', async () => {
      await expect(sendEventToAudit(CERTIFICATE_GENERATION_AUDIT, 'DDI Create Something', 'created something', {})).rejects.toThrow('Username and displayname are required for auditing of uk.gov.defra.ddi.event.certificate.issued')
    })
  })

  describe('sendCertificateIssuedToAudit', () => {
    test('should fail given no user', async () => {
      await expect(sendCertificateIssuedToAudit({
        dog: {
          indexNumber: 'ED123',
          name: 'Rex'
        }
      }, {})).rejects.toThrow('Username and displayname are required for auditing certificate issued')
    })

    test('should send successfully', async () => {
      await sendCertificateIssuedToAudit({
        dog: {
          indexNumber: 'ED123',
          name: 'Rex'
        },
        user: validUser
      })

      expect(sendEvent).toBeCalledWith(
        {
          data: {
            message: '{"actioningUser":{"username":"hal-9000","displayname":"Hal 9000"},"operation":"certificate issued","details":{"dog":{"indexNumber":"ED123","name":"Rex"}}}'
          },
          id: expect.any(String),
          partitionKey: 'ED123',
          source: 'aphw-ddi-documents',
          subject: 'DDI Certificate Issued',
          type: 'uk.gov.defra.ddi.event.certificate.issued'
        })
    })
  })

  describe('determinePk', () => {
    test('should get dog index number if gen cert type', () => {
      const entity = { dog: { indexNumber: 'ED123' } }
      const pk = determinePk(entity, CERTIFICATE_GENERATION_AUDIT)

      expect(pk).toBe('ED123')
    })
  })
})
