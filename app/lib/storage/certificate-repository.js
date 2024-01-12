const { blobServiceClient } = require('./get-blob-client')
const { blobConfig } = require('../../config/storage')

const uploadCertificate = async (filename, buffer) => {
  const container = blobServiceClient.getContainerClient(blobConfig.certificateContainer)

  await container.createIfNotExists()

  const blobClient = container.getBlockBlobClient(filename)

  await blobClient.uploadData(buffer)

  return blobClient
}

module.exports = {
  uploadCertificate
}
