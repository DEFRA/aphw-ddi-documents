describe('Populate-template test', () => {
  jest.mock('../../../../app/lib/storage/repos/attachments')
  const { getAttachmentFile } = require('../../../../app/lib/storage/repos/attachments')

  jest.mock('../../../../app/lib/storage/repos/uploading')
  const { uploadFile } = require('../../../../app/lib/storage/repos/uploading')

  const createServer = require('../../../../app/server')
  let server

  const saveFn = jest.fn()
  const setTextFn1 = jest.fn()
  const setTextFn2 = jest.fn()
  let field1
  let field2

  beforeEach(async () => {
    jest.resetAllMocks()

    jest.mock('pdf-lib')
    const { PDFDocument, PDFTextField } = require('pdf-lib')

    field1 = new PDFTextField()
    field1.getName = jest.fn().mockReturnValue('ddi_field_name_1')
    field1.setText = setTextFn1
    field2 = new PDFTextField()
    field2.getName = jest.fn().mockReturnValue('ddi_field_name_2')
    field2.setText = setTextFn2

    PDFDocument.load = jest.fn().mockReturnValue({
      getForm: jest.fn().mockReturnValue({
        getFields: jest.fn().mockReturnValue([
          field1,
          field2
        ])
      }),
      save: saveFn
    })

    getAttachmentFile.mockResolvedValue()
    uploadFile.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  test('POST /populate-template route returns 200 when saved file', async () => {
    const options = {
      method: 'POST',
      url: '/populate-template',
      payload: {
        fileInfo: {
          filename: 'file1.pdf',
          fileGuid: 'abcdef',
          saveFile: true
        },
        fieldData: {
          ddi_field_name_1: 'field1Value',
          ddi_field_name_2: 'field2Value'
        }
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setTextFn1).toHaveBeenCalledWith('field1Value')
    expect(setTextFn2).toHaveBeenCalledWith('field2Value')
    expect(uploadFile).toHaveBeenCalled()
  })

  test('POST /populate-template route returns file contents when not saving file', async () => {
    const options = {
      method: 'POST',
      url: '/populate-template',
      payload: {
        fileInfo: {
          filename: 'file1.pdf'
        },
        fieldData: {
          ddi_field_name_1: 'field1Value',
          ddi_field_name_2: 'field2Value'
        }
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(204)
    expect(setTextFn1).toHaveBeenCalledWith('field1Value')
    expect(setTextFn2).toHaveBeenCalledWith('field2Value')
    expect(uploadFile).not.toHaveBeenCalled()
  })

  afterEach(async () => {
    await server.stop()
  })
})
