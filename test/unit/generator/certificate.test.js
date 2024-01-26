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
      line1: '1 Test Street',
      line2: 'Testarea',
      line3: 'Testington',
      postcode: 'TS1 1TS'
    }

    const res = shuffleUpAddressLines(address)

    expect(res).toBe('1 Test Street\nTestarea\nTestington\nTS1 1TS')
  })

  test('shuffleUp should handle missing address line 1', () => {
    const address = {
      line2: 'Testarea',
      line3: 'Testington',
      postcode: 'TS1 1TS'
    }

    const res = shuffleUpAddressLines(address)

    expect(res).toBe('Testarea\nTestington\nTS1 1TS')
  })

  test('shuffleUp should handle missing address line 2', () => {
    const address = {
      line1: '1 Test Street',
      line2: '',
      line3: 'Testington',
      postcode: 'TS1 1TS'
    }

    const res = shuffleUpAddressLines(address)

    expect(res).toBe('1 Test Street\nTestington\nTS1 1TS')
  })

  test('shuffleUp should handle missing address line 3', () => {
    const address = {
      line1: '1 Test Street',
      line2: 'Testarea',
      postcode: 'TS1 1TS'
    }

    const res = shuffleUpAddressLines(address)

    expect(res).toBe('1 Test Street\nTestarea\nTS1 1TS')
  })

  test('shuffleUp should handle missing postcode', () => {
    const address = {
      line1: '1 Test Street',
      line2: 'Testarea',
      line3: 'Testington'
    }

    const res = shuffleUpAddressLines(address)

    expect(res).toBe('1 Test Street\nTestarea\nTestington')
  })
})
