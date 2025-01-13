const PDFDocument = require('pdfkit-table')

const { findFont } = require('./fonts')
const { formatDate, formatDateAsTimestamp } = require('../date-helpers')

const calcTableWidth = (table) => {
  return table.headers.reduce((accumulator, current) => accumulator + current.width, 0)
}

const doStripe = (doc, fontId, size, indexRow, rectCell) => {
  doc.font(findFont(fontId)).fontSize(size)
  indexRow % 2 === 0 && doc.addBackground(rectCell, 'grey', 0.15)
}

const doHeader = (doc, template, values) => {
  template.currentPageNum++
  const header = template.definition.filter(x => x.type === 'header')
  if (header?.length > 0) {
    const headerTemplate = { ...template, definition: header[0].content }
    processTemplate(doc, headerTemplate, values)
  }
}

const doFooter = (doc, template, _values) => {
  const footer = template.definition.filter(x => x.type === 'footer')
  if (footer?.length > 0) {
    const range = doc.bufferedPageRange()
    const { size, x, y } = footer[0].content[0]
    const options = { size }
    for (let pageNum = range.start; pageNum < range.start + range.count; pageNum++) {
      doc.switchToPage(pageNum)
      doc.text(`Page ${pageNum + 1} of ${range.count}`, x, y, options)
    }
  }
}

const processTemplate = (doc, template, values) => {
  for (const item of template.definition) {
    const { type, name, key, text, items, font: fontId, size, x, y, lineBreak, table, width, height, options } = item

    switch (type) {
      case 'text': {
        let value = values[key] ? values[key] : text
        if (value.indexOf('{timestamp}') > -1) {
          value = value.replace('{timestamp}', formatDateAsTimestamp(new Date()))
        }

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

        const preTable = {
          pageNum: template.currentPageNum,
          y: doc.y
        }

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

        const postTable = {
          pageNum: template.currentPageNum,
          y: doc.y
        }

        if (options?.outerBorder?.disabled === false) {
          const rectX = options.x ?? startX
          const rectY = options.y ?? startY
          if (options.outerBorder?.width) {
            doc.lineWidth(options.outerBorder.width)
          }
          // Handle split over page break
          if (postTable.pageNum > preTable.pageNum) {
            const marginTop = doc._pageBuffer ? doc._pageBuffer[0].margins.top : 65
            const pageHeight = doc._pageBuffer ? doc._pageBuffer[0].height : 530
            doc.switchToPage(preTable.pageNum - 1)
            doc.rect(rectX, preTable.y, calcTableWidth(table), pageHeight - marginTop - preTable.y)
            doc.stroke()
            doc.switchToPage(postTable.pageNum - 1)
            doc.rect(rectX, 65, calcTableWidth(table), doc.y - marginTop - padding - titleOffset)
            doc.stroke()
          } else {
            doc.rect(rectX, rectY, calcTableWidth(table), doc.y - rectY - padding - titleOffset)
            doc.stroke()
          }
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
  template.currentPageNum = 0
  return new Promise((resolve) => {
    const values = getCertificateValues(data)

    const doc = new PDFDocument({ autoFirstPage: false, bufferPages: true })

    const chunks = []

    doc.on('data', (chunk) => {
      chunks.push(chunk)
    })

    doc.on('end', () => {
      const buffer = Buffer.concat(chunks)

      resolve(buffer)
    })

    doc.on('pageAdded', () => doHeader(doc, template, values))

    processTemplate(doc, template, values)

    doFooter(doc, template, values)

    doc.flushPages()

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
