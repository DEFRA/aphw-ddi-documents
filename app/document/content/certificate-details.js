const certificateDetails = (data) => {
  return {
    stack: [
      { text: 'This is to certfy that the dog described herein has been successfully registered in accordance with the relevant secton of legislaton on .\n\n\n' },
      { text: 'Registraton Details \n\n', style: 'subheader' },
      { text: 'Dogs Name: \n' },
      { text: 'Date of Birth: \n' },
      { text: 'Breed: \n' },
      { text: 'Colour: \n' },
      { text: 'Microchip Number: \n' },
      { text: `Unique Registration Number: ${data.reference} \n\n` },
      { qr: data.reference },
      { text: '\n\n' },
      { text: 'Important Information \n\n', style: 'subheader' },
      { text: 'hello \n' }
    ]
  }
}

module.exports = certificateDetails
