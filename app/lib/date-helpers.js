const { format } = require('date-fns')

const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy')
}

const formatDateAsWords = (date) => {
  return format(date, 'd MMM yyyy')
}

module.exports = {
  formatDate,
  formatDateAsWords
}
