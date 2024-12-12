const { blobServiceClient } = require('../get-blob-client')
const { storageConfig } = require('../../../config')

const getAttachmentFile = async (filename) => {
  const container = blobServiceClient.getContainerClient(storageConfig.attachmentsContainer)

  await container.createIfNotExists()

  const blobClient = container.getBlockBlobClient(filename)

  const exists = await blobClient.exists()

  if (!exists) {
    throw new Error(`Attachment (${filename}) does not exist`)
  }

  return blobClient.downloadToBuffer()
}

module.exports = {
  getAttachmentFile
}
