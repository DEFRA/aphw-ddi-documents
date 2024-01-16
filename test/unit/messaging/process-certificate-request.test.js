describe('process certificate request message', () => {
  jest.mock('../../../app/lib/generator/certificate')
  const { generateCertificate } = require('../../../app/lib/generator/certificate')

  jest.mock('../../../app/lib/storage/repos/certificate')
  const { uploadCertificate } = require('../../../app/lib/storage/repos/certificate')

  jest.mock('../../../app/lib/storage/repos/certificate-template')
  const { getCertificateTemplate } = require('../../../app/lib/storage/repos/certificate-template')

  const processCertificateIssueRequest = require('../../../app/messaging/inbound/certificates/process-certificate-request')

  const mockReceiver = require('../../mocks/messaging/receiver')

  const { valid, invalid } = require('../../mocks/messaging/certificate-request')

  beforeEach(() => {
    jest.clearAllMocks()

    getCertificateTemplate.mockResolvedValue({})
    generateCertificate.mockResolvedValue(Buffer.from(''))
  })

  test('should generate certificate', async () => {
    await expect(processCertificateIssueRequest(valid, mockReceiver)).resolves.toBeUndefined()

    expect(getCertificateTemplate).toHaveBeenCalledTimes(1)
    expect(getCertificateTemplate).toHaveBeenCalledWith(valid.body.exemptionOrder)

    expect(generateCertificate).toHaveBeenCalledTimes(1)
    expect(generateCertificate).toHaveBeenCalledWith({}, {
      exemptionOrder: 2015,
      certificateId: '24bfda00-efa5-41d4-8711-9d31d7fcca65',
      owner: {
        name: 'Mr Owner',
        address: {
          line1: '1 The Street',
          line2: '',
          line3: '',
          postcode: 'AB12 3CD'
        }
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '12345',
        name: 'Fido',
        breed: 'Breed 1',
        sex: 'Male',
        birthDate: new Date('2019-01-01'),
        colour: 'White',
        certificateIssued: new Date('2020-01-01')
      }
    })

    expect(uploadCertificate).toHaveBeenCalledTimes(1)
    expect(uploadCertificate).toHaveBeenCalledWith(valid.body.dog.indexNumber, valid.body.certificateId, Buffer.from(''))

    expect(mockReceiver.completeMessage).toHaveBeenCalledTimes(1)
  })

  test('should throw error if invalid message', async () => {
    await expect(processCertificateIssueRequest(invalid, mockReceiver)).resolves.toBeUndefined()

    expect(mockReceiver.completeMessage).not.toHaveBeenCalled()
    expect(mockReceiver.deadLetterMessage).toHaveBeenCalledTimes(1)
  })
})
