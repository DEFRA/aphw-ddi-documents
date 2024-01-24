const { blobServiceClient } = require('../get-blob-client')
const { storageConfig } = require('../../../config')

const uploadCertificate = async (indexNumber, certificateId, buffer) => {
  console.log(`uploadCertificate starting. Container ${storageConfig.certificateContainer}`)

  const container = blobServiceClient.getContainerClient(storageConfig.certificateContainer)

  await container.createIfNotExists()

  console.log('uploadCertificate got container')

  const blobClient = container.getBlockBlobClient(`${indexNumber}/${certificateId}.pdf`)

  console.log('uploadCertificate got client')

  await blobClient.uploadData(buffer)

  console.log('uploadCertificate uploaded data')
}

module.exports = {
  uploadCertificate
}
