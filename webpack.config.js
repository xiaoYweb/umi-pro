/**
 * 该文件只是为了让webstorm等编辑器识别路径别名，无特别意义
 */
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
