const PDFDocument = require('pdfkit')

const { getCertificateTemplate } = require('../storage/repos/certificate-template')
const { findFont } = require('./fonts')
const { formatDate } = require('../date-helpers')

const processTemplate = (doc, files, values) => {
  for (const item of files.template) {
    const { type, name, key, text, items, font: fontId, size, x, y, lineBreak, options } = item

    switch (type) {
      case 'text':
        const value = values[key] ? values[key] : text

        doc.font(findFont(fontId))
          .fontSize(size)

        if (x && y) {
          doc.text(value, x, y, options)
        } else {
          doc.text(value, options)
        }

        break
      case 'image':
        doc.image(files[name], x, y, options)
        break
      case 'list':
        doc.font(findFont(fontId))
          .fontSize(size)
          .list(items, options)
        break;
      case 'page':
        doc.addPage(options)
        break
      default:
        throw new Error(`Unknown type ${type}`)
    }

    if (lineBreak) {
      doc.moveDown(lineBreak)
    }
  }
}

const getCertificateValues = (data) => ({
  ownerName: data.owner.name,
  addressLine1: data.owner.address.line1,
  addressLine2: data.owner.address.line2,
  addressLine3: data.owner.address.line3,
  addressPostcode: data.owner.address.postcode,
  dogIndexNumber: data.dog.indexNumber,
  dogMicrochipNumber: data.dog.microchipNumber,
  dogName: data.dog.name,
  dogBreed: data.dog.breed,
  dogSex: data.dog.sex,
  dogBirthDate: formatDate(data.dog.birthDate),
  dogColour: data.dog.colour,
  certificateIssueDate: formatDate(data.dog.certificateIssued)
})

const generateCertificate = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const files = await getCertificateTemplate(data.exemptionOrder)

      const values = getCertificateValues(data)

      const doc = new PDFDocument({ autoFirstPage: false })
  
      processTemplate(doc, files, values)
  
      doc.end()
  
      const chunks = []
  
      doc.on('data', (chunk) => {
        chunks.push(chunk)
      })
  
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks)
  
        resolve(buffer)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  generateCertificate
}