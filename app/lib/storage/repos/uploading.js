const { blobServiceClient } = require('../get-blob-client')

const uploadFile = async (containerName, indexNumber, certificateId, buffer) => {
  const container = blobServiceClient.getContainerClient(containerName)

  await container.createIfNotExists()

  const blobClient = container.getBlockBlobClient(`${indexNumber}/${certificateId}.pdf`)

  await blobClient.uploadData(buffer)
}

module.exports = {
  uploadFile
}
