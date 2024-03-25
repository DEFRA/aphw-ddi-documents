const PDFDocument = require('pdfkit')

const { findFont } = require('./fonts')
const { formatDate } = require('../date-helpers')

const processTemplate = (doc, template, values) => {
  for (const item of template.definition) {
    const { type, name, key, text, items, font: fontId, size, x, y, lineBreak, options } = item

    switch (type) {
      case 'text': {
        const value = values[key] ? values[key] : text

        doc.font(findFont(fontId))
          .fontSize(size)

        if (x && y) {
          doc.text(value, x, y, options)
        } else {
          doc.text(value, options)
        }

        break
      }
      case 'image': {
        doc.image(template[name], x, y, options)
        break
      }
      case 'list': {
        doc.font(findFont(fontId))
          .fontSize(size)
          .list(items, options)
        break
      }
      case 'page': {
        doc.addPage(options)
        break
      }
    }

    if (lineBreak) {
      doc.moveDown(lineBreak)
    }
  }
}

const getCertificateValues = (data) => {
  const model = {
    organisationName: data.owner.organisationName,
    ownerName: data.owner.name,
    addressLine1: shuffleUpAddressLines(data.owner.address),
    dogIndexNumber: data.dog.indexNumber,
    dogMicrochipNumber: data.dog.microchipNumber,
    dogName: data.dog.name,
    dogBreed: data.dog.breed,
    dogSex: data.dog.sex,
    dogBirthDate: data.dog.birthDate ? formatDate(data.dog.birthDate) : '',
    dogColour: data.dog.colour,
    certificateIssueDate: data.dog.certificateIssued ? formatDate(data.dog.certificateIssued) : formatDate(new Date())
  }
  shuffleUpAddressLines(model)
  return model
}

const shuffleUpAddressLines = (addr) => {
  const lines = []
  lines.push(addr.line1)
  lines.push(addr.line2)
  lines.push(addr.line3)
  lines.push(addr.postcode)
  const shuffledUp = lines.filter(x => {
    return x && x !== ''
  })
  return shuffledUp.join('\n')
}

const generateCertificate = (template, data) => {
  return new Promise((resolve) => {
    const values = getCertificateValues(data)

    const doc = new PDFDocument({ autoFirstPage: false })

    const chunks = []

    doc.on('data', (chunk) => {
      chunks.push(chunk)
    })

    doc.on('end', () => {
      const buffer = Buffer.concat(chunks)

      resolve(buffer)
    })

    processTemplate(doc, template, values)

    doc.end()
  })
}

module.exports = {
  generateCertificate,
  shuffleUpAddressLines
}
