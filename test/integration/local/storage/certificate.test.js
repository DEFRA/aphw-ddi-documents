describe('certificate repo', () => {
  const { storageConfig } = require('../../../../app/config')
  const { blobServiceClient } = require('../../../../app/lib/storage/get-blob-client')
  const { uploadFile } = require('../../../../app/lib/storage/repos/uploading')

  beforeAll(async () => {
    const container = blobServiceClient.getContainerClient(storageConfig.certificateContainer)

    await container.createIfNotExists()
  })

  test('should upload certificate', async () => {
    const buffer = Buffer.from('hello world')

    await uploadFile('certificates', 123456, '24bfda00-efa5-41d4-8711-9d31d7fcca65', buffer)

    const container = blobServiceClient.getContainerClient(storageConfig.certificateContainer)
    const blobClient = container.getBlockBlobClient('123456/24bfda00-efa5-41d4-8711-9d31d7fcca65.pdf')

    const exists = await blobClient.exists()

    expect(exists).toEqual(true)
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await blobServiceClient.deleteContainer(storageConfig.certificateContainer)
  })
})
