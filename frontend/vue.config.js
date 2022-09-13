/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const { defineConfig } = require('@vue/cli-service')


/**************************************************************************
  * EXPORTS
  ***************************************************************************/

// Configuration
module.exports = defineConfig({
  transpileDependencies: true
})

// Variables globales
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/css/variables.scss";'
      }
    }
  }
}
