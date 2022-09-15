/**************************************************************************
  * IMPORTS
  ***************************************************************************/
const { defineConfig } = require('@vue/cli-service')


/**************************************************************************
  * EXPORTS
  ***************************************************************************/

// CONFIGURATION
module.exports = defineConfig({
  transpileDependencies: true
})

// GLOBAL VARIABLES
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/css/variables.scss";'
      }
    }
  }
}
