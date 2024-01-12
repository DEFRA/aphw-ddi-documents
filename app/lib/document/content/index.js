const certificateDetails = require('./certificate-details')

const createContent = (data) => {
  return [
    certificateDetails(data)
  ]
}

module.exports = createContent
