const PDFDocument = require('pdfkit-table')

const { findFont } = require('./fonts')
const { formatDate } = require('../date-helpers')

const calcTableWidth = (table) => {
  return table.headers.reduce((accumulator, current) => accumulator + current.width, 0)
}

const doStripe = (doc, fontId, size, indexRow, rectCell) => {
  doc.font(findFont(fontId)).fontSize(size)
  indexRow % 2 === 0 && doc.addBackground(rectCell, 'grey', 0.15)
}

const processTemplate = (doc, template, values) => {
  for (const item of template.definition) {
    const { type, name, key, text, items, font: fontId, size, x, y, lineBreak, table, width, height, options } = item

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
      case 'table': {
        const startX = doc.x
        const startY = doc.y
        const padding = options?.padding ?? 0
        const titleOffset = options?.title ? padding : 0

        if (options?.stripedRows) {
          options.prepareRow = (_row, _indexColumn, indexRow, _rectRow, rectCell) => {
            doStripe(doc, fontId, size, indexRow, rectCell)
          }
        }

        if (table.rowDataKey) {
          table.rows = values[table.rowDataKey]
        }

        if (options?.title) {
          doc.font(findFont(options.title.font))
            .fontSize(options.title.size)
          doc.text(options.title.label, (options.x ?? startX) + padding, (options.y ?? startY) + padding - 2)
          delete options.title
          options.subtitle = ' '
        }

        options.x = options.x ?? startX
        options.y = options.y ?? startY

        doc.table(table, options)

        if (options?.outerBorder?.disabled === false) {
          const rectX = options.x ?? startX
          const rectY = options.y ?? startY
          if (options.outerBorder?.width) {
            doc.lineWidth(options.outerBorder.width)
          }
          doc.rect(rectX, rectY, calcTableWidth(table), doc.y - rectY - padding - titleOffset)
          doc.stroke()
        }
        break
      }
      case 'rect': {
        doc.rect(x, y, width, height)
        doc.stroke()
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
    certificateIssueDate: data.dog.certificateIssued ? formatDate(data.dog.certificateIssued) : formatDate(new Date()),
    dogDetails: data.dogDetails,
    ownerDetails: data.ownerDetails,
    exemptionDetails: data.exemptionDetails,
    recordHistory: data.recordHistory
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
  shuffleUpAddressLines,
  processTemplate,
  doStripe,
  calcTableWidth
}
