const { blobServiceClient } = require('../../../app/lib/storage/get-blob-client')
jest.mock('../../../app/lib/storage/get-blob-client')

const downloadFn = jest.fn()

blobServiceClient.getContainerClient.mockReturnValue({
  createIfNotExists: jest.fn(),
  getBlockBlobClient: jest.fn().mockReturnValue({
    exists: jest.fn().mockResolvedValue(true),
    downloadToBuffer: downloadFn
  })
})

const { getAttachmentFile } = require('../../../app/lib/storage/repos/attachments')

describe('storage repos attachments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAttachmentFile', () => {
    test('should get attachment file if exists', async () => {
      const res = await getAttachmentFile()
      expect(res).not.toBe(null)
      expect(downloadFn).toHaveBeenCalled()
    })

    test('should throw if file doesnt exist', async () => {
      blobServiceClient.getContainerClient.mockReturnValue({
        createIfNotExists: jest.fn(),
        getBlockBlobClient: jest.fn().mockReturnValue({
          exists: jest.fn().mockResolvedValue(false),
          downloadToBuffer: downloadFn
        })
      })
      await expect(() => getAttachmentFile('file123.pdf')).rejects.toThrow('Attachment (file123.pdf) does not exist')
    })
  })
})
