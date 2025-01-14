const { formatDate, formatDateAsWords, formatDateAsTimestamp } = require('../../../app/lib/date-helpers')

describe('date-helpers', () => {
  describe('formatDate', () => {
    test('should format date', () => {
      expect(formatDate(new Date(2024, 10, 5))).toBe('05/11/2024')
    })
  })

  describe('formatDateAsWords', () => {
    test('should format date with single day number', () => {
      expect(formatDateAsWords(new Date(2024, 10, 5))).toBe('5 Nov 2024')
    })

    test('should format date', () => {
      expect(formatDateAsWords(new Date(2024, 10, 15))).toBe('15 Nov 2024')
    })
  })

  describe('formatDateAsTimestamp', () => {
    test('should format date with single day number and morning time', () => {
      expect(formatDateAsTimestamp(new Date(2024, 10, 5, 9, 23))).toBe('5 Nov 2024 09:23')
    })

    test('should format date with souble day number and afternoon time', () => {
      expect(formatDateAsTimestamp(new Date(2024, 10, 15, 19, 23))).toBe('15 Nov 2024 19:23')
    })
  })
})
