const { blobServiceClient } = require('../get-blob-client')
const { storageConfig } = require('../../../config')

const uploadCertificate = async (indexNumber, buffer) => {
  const container = blobServiceClient.getContainerClient(storageConfig.certificateContainer)

  await container.createIfNotExists()

  const filename = `${indexNumber}_${new Date().toJSON().slice(0,10).replaceAll('-', '_')}.pdf`

  const blobClient = container.getBlockBlobClient(`${indexNumber}/${filename}`)

  await blobClient.uploadData(buffer)
}

module.exports = {
  uploadCertificate
}
