const { PDFDocument, PDFTextField } = require('pdf-lib')
const { getAttachmentFile } = require('../lib/storage/repos/attachments')
const { uploadFile } = require('../lib/storage/repos/uploading')
const { storageConfig } = require('../config')

module.exports = {
  method: 'POST',
  path: '/populate-template',
  handler: async (request, h) => {
    const { filename, fileGuid, saveFile, flattenPdf } = request.payload.fileInfo
    const { fieldData } = request.payload

    const file = await getAttachmentFile(filename)
    const doc = await PDFDocument.load(file)
    const form = doc.getForm()
    const fields = form.getFields()
    const dataKeys = Object.keys(fieldData)

    for (const field of fields) {
      if (field instanceof PDFTextField) {
        const fieldName = field.getName()
        if (fieldName.startsWith('ddi_') && dataKeys.includes(fieldName)) {
          field.setText(fieldData[fieldName])
        }
      }
    }

    if (flattenPdf) {
      form.flatten()
    }

    const pdfBytes = await doc.save()
    //
    // Ensure that any fields you want populated (but dont want to be editable) are set as 'readonly' in Acrobat
    //

    if (saveFile && fileGuid) {
      await uploadFile(storageConfig.attachmentsContainer, 'temp-populations', fileGuid, pdfBytes)
      return h.response().code(200)
    }

    return h.response(pdfBytes).type('application/pdf')
  }
}
