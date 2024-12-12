const { generateCertificate } = require('../lib/generator/certificate')
const { uploadCertificate } = require('../lib/storage/repos/certificate')
const { getCertificateTemplate } = require('../lib/storage/repos/certificate-template')

module.exports = {
  method: 'GET',
  path: '/test-export',
  handler: async (request, h) => {
    const template = await getCertificateTemplate('export')

    const data = {
      dog: {
        indexNumber: 'ED701234'
      },
      owner: {
        name: 'John Smith',
        address: {
          line1: '1 Test Street',
          postcode: 'TS1 1TS'
        }
      },
      dogDetails: [
        ['Index number:', 'ED100001'],
        ['Name:', 'Rex'],
        ['Breed type:', 'Pit Bull Terrier'],
        ['Colour:', 'Brown'],
        ['Sex:', 'Male'],
        ['Date of birth:', '12/02/2018'],
        ['Microchip number:', '123451234512345']
      ],
      ownerDetails: [
        ['Name:', 'John Smith'],
        ['Date of birth:', '12/11/1987'],
        ['Address:', '1 Test Street'],
        ['', 'Test area'],
        ['', 'Testington'],
        ['', 'TS1 1TS'],
        ['Country:', 'England']
      ],
      outFilename: 'export'
    }

    const cert = await generateCertificate(template, data)

    console.log('Generated certificate')

    await uploadCertificate(data.dog.indexNumber, data.outFilename, cert)

    return h.response('ok').code(200)
  }
}
