describe('extend data', () => {
  const { extendData } = require('../../../app/lib/generator/extend-data')

  test('should return original data if not police download', () => {
    const res = extendData('other-template', { something: 'someVal' })
    expect(res).toEqual({ something: 'someVal' })
  })

  test('should handle dog + owner + exemption details with minimal data', () => {
    const minimalData = {
      dog: { indexNumber: 'ED123', breed: 'Breed1' },
      owner: { name: 'John Smith', address: { line1: '1 Test Street' } },
      exemption: { status: 'Exempt', exemptionOrder: '2015' }
    }
    const res = extendData('police-download', minimalData)
    expect(res).toEqual({
      dog: {
        indexNumber: 'ED123',
        breed: 'Breed1'
      },
      owner: {
        name: 'John Smith',
        address: {
          line1: '1 Test Street'
        }
      },
      exemption: {
        exemptionOrder: '2015',
        status: 'Exempt'
      },
      dogDetails: [
        ['Index number:', 'ED123'],
        ['Name:', 'Not recorded'],
        ['Breed type:', 'Breed1'],
        ['Colour:', 'Not recorded'],
        ['Sex:', 'Not recorded'],
        ['Date of birth:', 'Not recorded'],
        ['Microchip number:', 'Not recorded']
      ],
      ownerDetails: [
        ['Name:', 'John Smith'],
        ['Date of birth:', 'Not recorded'],
        ['Address:', '1 Test Street'],
        [' ', ' '],
        [' ', ' '],
        [' ', ' '],
        ['Country:', '']
      ],
      exemptionDetails: [
        ['Status:', 'Exempt', '', 'CDO issue date:', ''],
        ['Breach reason(s):', 'Not applicable', '', 'CDO expiry date:', ''],
        ['Exemption order:', '2015', '', 'Last known insurance', ''],
        ['Certificate issued date:', 'Not recorded', '', 'renewal date:', 'Not recorded']
      ],
      recordHistory: [
        ['Date', 'Activity']
      ]
    })
  })

  test('should handle all fields populated', () => {
    const minimalData = {
      dog: { indexNumber: 'ED123', breed: 'Breed1', name: 'Rex', colour: 'Brown', sex: 'Male', birthDate: new Date(2020, 2, 1), microchipNumber: '123451234512345', microchipNumber2: '111112222233333' },
      owner: { name: 'John Smith', address: { line1: '1 Test Street', line2: 'Testarea', line3: 'Testington', postcode: 'TS1 1TS', country: 'England' }, birthDate: new Date(1990, 5, 3) },
      exemption: { status: 'In breach', exemptionOrder: '2015', cdoIssued: new Date(2024, 5, 5), cdoExpiry: new Date(2024, 7, 5), certificateIssued: new Date(2025, 2, 2), insuranceRenewal: new Date(2025, 11, 17), breachReasons: ['Reason 1', 'Reason 2'] },
      history: [
        { date: '1 May 2024', activityLabel: 'Simple activity' },
        { date: '2 May 2024', activityLabel: 'Complex activity:', childList: [['abc'], ['def'], ['ghi']] }
      ]
    }
    const res = extendData('police-download', minimalData)

    expect(res).toEqual({
      dog: {
        indexNumber: 'ED123',
        breed: 'Breed1',
        name: 'Rex',
        colour: 'Brown',
        sex: 'Male',
        birthDate: new Date(2020, 2, 1),
        microchipNumber: '123451234512345',
        microchipNumber2: '111112222233333'
      },
      owner: {
        name: 'John Smith',
        birthDate: new Date(1990, 5, 3),
        address: {
          line1: '1 Test Street',
          line2: 'Testarea',
          line3: 'Testington',
          postcode: 'TS1 1TS',
          country: 'England'
        }
      },
      exemption: {
        exemptionOrder: '2015',
        status: 'In breach',
        cdoIssued: new Date(2024, 5, 5),
        cdoExpiry: new Date(2024, 7, 5),
        certificateIssued: new Date(2025, 2, 2),
        insuranceRenewal: new Date(2025, 11, 17),
        breachReasons: ['Reason 1', 'Reason 2']
      },
      history: [
        { date: '2 May 2024', activityLabel: 'Complex activity:', childList: [['abc'], ['def'], ['ghi']] },
        { date: '1 May 2024', activityLabel: 'Simple activity' }
      ],
      dogDetails: [
        ['Index number:', 'ED123'],
        ['Name:', 'Rex'],
        ['Breed type:', 'Breed1'],
        ['Colour:', 'Brown'],
        ['Sex:', 'Male'],
        ['Date of birth:', '1 Mar 2020'],
        ['Microchip number:', '123451234512345'],
        ['', '111112222233333']
      ],
      ownerDetails: [
        ['Name:', 'John Smith'],
        ['Date of birth:', '3 Jun 1990'],
        ['Address:', '1 Test Street'],
        [' ', 'Testarea'],
        [' ', 'Testington'],
        [' ', 'TS1 1TS'],
        ['Country:', 'England']
      ],
      exemptionDetails: [
        ['Status:', 'In breach', '', 'CDO issue date:', '5 Jun 2024'],
        ['Breach reason(s):', '- Reason 1\n- Reason 2', '', 'CDO expiry date:', '5 Aug 2024'],
        ['Exemption order:', '2015', '', 'Last known insurance', ''],
        ['Certificate issued date:', '2 Mar 2025', '', 'renewal date:', '17 Dec 2025']
      ],
      recordHistory: [
        ['Date', 'Activity'],
        ['2 May 2024', 'Complex activity:'],
        ['', ' - abc'],
        ['', ' - def'],
        ['', ' - ghi'],
        ['1 May 2024', 'Simple activity']
      ]
    })
  })
})
