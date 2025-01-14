describe('format data', () => {
  const { valueOrNotRecorded, getAddressLabel, shuffleAddress, createBullets } = require('../../../app/lib/generator/format-data')

  describe('valueOrNotRecorded', () => {
    test('should return value', () => {
      const cert = valueOrNotRecorded('value1')
      expect(cert).toEqual('value1')
    })

    test('should return Not recorded', () => {
      const cert = valueOrNotRecorded(null)
      expect(cert).toEqual('Not recorded')
    })

    test('should return Not recorded when blank string', () => {
      const cert = valueOrNotRecorded('')
      expect(cert).toEqual('Not recorded')
    })

    test('should trim if leading/trailing spaces string', () => {
      const cert = valueOrNotRecorded('  abc   ')
      expect(cert).toEqual('abc')
    })
  })

  describe('getAddressLabel', () => {
    test('should return label', () => {
      const cert = getAddressLabel([])
      expect(cert).toEqual('Address:')
    })

    test('should return blank string (single space)', () => {
      const cert = getAddressLabel([1])
      expect(cert).toEqual(' ')
    })
  })

  describe('shuffleAddress', () => {
    test('should handle full address', () => {
      const address = {
        line1: '1 Test Street',
        line2: 'Testarea',
        line3: 'Testington',
        postcode: 'TS1 1TS'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', '1 Test Street'],
        [' ', 'Testarea'],
        [' ', 'Testington'],
        [' ', 'TS1 1TS']
      ])
    })

    test('should handle missing address line 1', () => {
      const address = {
        line2: 'Testarea',
        line3: 'Testington',
        postcode: 'TS1 1TS'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', 'Testarea'],
        [' ', 'Testington'],
        [' ', 'TS1 1TS'],
        [' ', ' ']
      ])
    })

    test('should handle missing address line 2', () => {
      const address = {
        line1: '1 Test Street',
        line2: '',
        line3: 'Testington',
        postcode: 'TS1 1TS'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', '1 Test Street'],
        [' ', 'Testington'],
        [' ', 'TS1 1TS'],
        [' ', ' ']
      ])
    })

    test('should handle missing address line 3', () => {
      const address = {
        line1: '1 Test Street',
        line2: 'Testarea',
        postcode: 'TS1 1TS'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', '1 Test Street'],
        [' ', 'Testarea'],
        [' ', 'TS1 1TS'],
        [' ', ' ']
      ])
    })

    test('should handle missing postcode', () => {
      const address = {
        line1: '1 Test Street',
        line2: 'Testarea',
        line3: 'Testington'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', '1 Test Street'],
        [' ', 'Testarea'],
        [' ', 'Testington'],
        [' ', ' ']
      ])
    })

    test('should handle two missing lines', () => {
      const address = {
        line1: '1 Test Street',
        postcode: 'TS1 1TS'
      }

      const res = shuffleAddress(address)

      expect(res).toEqual([
        ['Address:', '1 Test Street'],
        [' ', 'TS1 1TS'],
        [' ', ' '],
        [' ', ' ']
      ])
    })
  })

  describe('createBullets', () => {
    test('should handle no rows', () => {
      expect(createBullets(null)).toEqual('')
    })

    test('should handle one row', () => {
      expect(createBullets(['test row text'])).toEqual('- Test row text')
    })

    test('should handle short row', () => {
      expect(createBullets(['a'])).toEqual('- a')
    })

    test('should handle many rows', () => {
      expect(createBullets(['test row text', 'row 2', 'row 3', 'Row 4'])).toEqual('- Test row text\n- Row 2\n- Row 3\n- Row 4')
    })
  })
})
