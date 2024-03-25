const valid = {
  body: {
    exemptionOrder: 2015,
    certificateId: '24bfda00-efa5-41d4-8711-9d31d7fcca65',
    owner: {
      name: 'Mr Owner',
      address: {
        line1: '1 The Street',
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
  }
}

const validWithOrg = {
  body: {
    exemptionOrder: 2023,
    certificateId: '24bfda00-efa5-41d4-8711-9d31d7fcca65',
    owner: {
      name: 'Mr Owner',
      address: {
        line1: '1 The Street',
        postcode: 'AB12 3CD'
      },
      organisationName: 'My Organisation'
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
  }
}

const invalid = {
  body: {
    exemptionOrder: 2027,
    owner: {
      name: 'Mr Owner',
      address: {
        line1: '1 The Street',
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
  }
}

module.exports = {
  valid,
  validWithOrg,
  invalid
}
