const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/test'),
  require('../routes/test-export')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
