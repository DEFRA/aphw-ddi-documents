describe('certificate generator', () => {
  const { generateCertificate, shuffleUpAddressLines } = require('../../../app/lib/generator/certificate')
  const template = require('../../mocks/messaging/template')
  const { valid } = require('../../mocks/messaging/certificate-request')

  test('should generate pdf', async () => {
    const cert = await generateCertificate(template, valid.body)

    expect(cert).toEqual(expect.any(Buffer))
  })

  test('shuffleUp should handle full address', () => {
    const address = {
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      addressLine3: 'Testington',
      addressPostcode: 'TS1 1TS'
    }

    shuffleUpAddressLines(address)

    expect(address.addressLine1).toBe('1 Test Street')
    expect(address.addressLine2).toBe('Testarea')
    expect(address.addressLine3).toBe('Testington')
    expect(address.addressPostcode).toBe('TS1 1TS')
  })

  test('shuffleUp should handle missing address line 1', () => {
    const address = {
      addressLine1: '',
      addressLine2: 'Testarea',
      addressLine3: 'Testington',
      addressPostcode: 'TS1 1TS'
    }

    shuffleUpAddressLines(address)

    expect(address.addressLine1).toBe('Testarea')
    expect(address.addressLine2).toBe('Testington')
    expect(address.addressLine3).toBe('TS1 1TS')
    expect(address.addressPostcode).toBe('')
  })

  test('shuffleUp should handle missing address line 2', () => {
    const address = {
      addressLine1: '1 Test Street',
      addressLine2: '',
      addressLine3: 'Testington',
      addressPostcode: 'TS1 1TS'
    }

    shuffleUpAddressLines(address)

    expect(address.addressLine1).toBe('1 Test Street')
    expect(address.addressLine2).toBe('Testington')
    expect(address.addressLine3).toBe('TS1 1TS')
    expect(address.addressPostcode).toBe('')
  })

  test('shuffleUp should handle missing address line 3', () => {
    const address = {
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      addressLine3: '',
      addressPostcode: 'TS1 1TS'
    }

    shuffleUpAddressLines(address)

    expect(address.addressLine1).toBe('1 Test Street')
    expect(address.addressLine2).toBe('Testarea')
    expect(address.addressLine3).toBe('TS1 1TS')
    expect(address.addressPostcode).toBe('')
  })

  test('shuffleUp should handle missing postcode', () => {
    const address = {
      addressLine1: '1 Test Street',
      addressLine2: 'Testarea',
      addressLine3: 'Testington',
      addressPostcode: ''
    }

    shuffleUpAddressLines(address)

    expect(address.addressLine1).toBe('1 Test Street')
    expect(address.addressLine2).toBe('Testarea')
    expect(address.addressLine3).toBe('Testington')
    expect(address.addressPostcode).toBe('')
  })
})
