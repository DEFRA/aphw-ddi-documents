const { PDFDocument, PDFTextField } = require('pdf-lib')
const { getAttachmentFile } = require('../lib/storage/repos/attachments')
const { uploadCertificate } = require('../lib/storage/repos/certificate')

module.exports = {
  method: 'GET',
  path: '/test',
  handler: async (request, h) => {
    const filename = request.query.filename
    console.log('JB test filename', filename)
    const file = await getAttachmentFile(filename)
    const doc = await PDFDocument.load(file)
    console.log('JB file', file.length)
    const form = doc.getForm()
    const fields = form.getFields()
    for (const field of fields) {
      if (field instanceof PDFTextField) {
        console.log('JB field', field.getName())
      }
    }
    const indexNumber = 'ED123456'
    const indexNumberField = form.getTextField('ddi_index_number')
    indexNumberField.setText(indexNumber)
    const pdfBytes = await doc.save()
    await uploadCertificate(indexNumber, 'populated', pdfBytes)

    return h.response('ok').code(200)
  }
}
