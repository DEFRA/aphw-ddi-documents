const { format } = require('date-fns')

const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy')
}

const formatDateAsWords = (date) => {
  return format(date, 'd MMM yyyy')
}

const formatDateAsTimestamp = (date) => {
  return format(date, 'd MMM yyyy HH:mm')
}

module.exports = {
  formatDate,
  formatDateAsWords,
  formatDateAsTimestamp
}
