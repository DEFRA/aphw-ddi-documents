const { blobServiceClient } = require('../get-blob-client')
const { storageConfig } = require('../../../config')

let template = {}
let logo
let signature

const getCertificateTemplate = async (exemptionOrder) => {
  if (!(template[exemptionOrder] && logo && signature)) {
    template[exemptionOrder] = await getTemplateFile(exemptionOrder)
    logo = await getStaticFile('logo.png')
    signature = await getStaticFile('signature.png')
  }

  return {
    template: JSON.parse(template[exemptionOrder]),
    logo,
    signature
  }
}

const getTemplateFile = async (exemptionOrder) => {
  const container = blobServiceClient.getContainerClient(storageConfig.certificateTemplateContainer)

  await container.createIfNotExists()

  const filename = `${exemptionOrder}.template.json`

  const blobClient = container.getBlockBlobClient(filename)

  const exists = await blobClient.exists()

  if (!exists) {
    throw new Error(`Template (${filename}) does not exist`)
  }

  const buffer = await blobClient.downloadToBuffer()

  return buffer.toString()
}

const getStaticFile = async (fileName) => {
  const container = blobServiceClient.getContainerClient(storageConfig.certificateTemplateContainer)

  await container.createIfNotExists()

  const blobClient = container.getBlockBlobClient(fileName)

  const exists = await blobClient.exists()

  if (!exists) {
    throw new Error(`File (${fileName}) does not exist`)
  }

  return blobClient.downloadToBuffer()
}

module.exports = {
  getCertificateTemplate
}
