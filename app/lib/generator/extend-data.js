const { formatDateAsWords } = require('../date-helpers')
const { valueOrNotRecorded, shuffleAddress } = require('./format-data')

const extendData = (templateName, data) => {
  if (templateName !== 'police-download') {
    return data
  }

  const extendedData = { ...data }

  extendedData.dogDetails = [
    ['Index number:', data.dog.indexNumber],
    ['Name:', valueOrNotRecorded(data.dog.name)],
    ['Breed type:', data.dog.breed],
    ['Colour:', valueOrNotRecorded(data.dog.colour)],
    ['Sex:', valueOrNotRecorded(data.dog.sex)],
    ['Date of birth:', data.dog.birthDate ? formatDateAsWords(data.dog.birthDate) : 'Not recorded'],
    ['Microchip number:', valueOrNotRecorded(data.dog.microchipNumber)]
  ]

  if (data.dog.microchipNumber2) {
    extendedData.dogDetails.push(['', data.dog.microchipNumber2])
  }

  extendedData.ownerDetails = [
    ['Name:', data.owner.name],
    ['Date of birth:', data.owner.birthDate ? formatDateAsWords(data.owner.birthDate) : 'Not recorded']
  ]

  extendedData.ownerDetails.push(...shuffleAddress(data.owner.address))

  extendedData.ownerDetails.push(['Country:', data.owner.address.country ?? ''])

  extendedData.exemptionDetails = [
    ['Status:', data.exemption.status, '', 'CDO issue date:', data.exemption.cdoIssued ? formatDateAsWords(data.exemption.cdoIssued) : ''],
    ['Breach reason(s):', data.exemption.breachReasons?.length ? data.exemption.breachReasons.join('\n') : 'Not applicable', '', 'CDO expiry date:', data.exemption.cdoExpiry ? formatDateAsWords(data.exemption.cdoExpiry) : ''],
    ['Exemption order:', data.exemption.exemptionOrder, '', 'Last known insurance', ''],
    ['Certificate issued date:', data.exemption.certificateIssued ? formatDateAsWords(data.exemption.certificateIssued) : 'Not recorded', '', 'renewal date:', data.exemption.insuranceRenewal ? formatDateAsWords(data.exemption.insuranceRenewal) : 'Not recorded']
  ]

  extendedData.recordHistory = [
    ['Date', 'Activity'],
    ['1 Dec 2024', 'Dog status set to In breach:']
  ]

  return extendedData
}

module.exports = {
  extendData
}
