const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: [
      'unitgeniuswebui.cyberrytechnologies.nl',
      'unitgeniusinput.cyberrytechnologies.nl',
      'unitgeniusoutput.cyberrytechnologies.nl',
      'auth.cyberrytechnologies.nl',
    ]
  }
})
