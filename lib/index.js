/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2019-11-19 13:49:00
 * @LastEditors: mayako
 * @LastEditTime: 2020-04-15 09:28:42
 */
function getUrl(obj) {
  let tmp = []
  Object.keys(obj).forEach(function (key) {
    tmp.push(obj[key].url)
  });
  return tmp
}

function getExternals(obj) {
  let tmp = {}
  Object.keys(obj).forEach(function (key) {
    tmp[key] = obj[key].name
  });
  return tmp
}

function autoImport(options) {
  this.options = options;
  this.options.setting.externals = getExternals(options.setting.importObj || {}) ? getExternals(options.setting.importObj || {}) : {}
  this.options.setting.url = getUrl(options.setting.importObj || {})
}
autoImport.prototype.apply = function (compiler) {
  compiler.options.externals = compiler.options.externals ? Object.assign(compiler.options.externals, this.options.setting.externals) : this.options.setting.externals
  compiler.options.output.library = this.options.setting.name
  let setting = this.options.setting
  compiler.hooks.compilation.tap('autoImport', function (compilation, options) {
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('autoImport', function (htmlPluginData, callback) {
      let v = JSON.parse(JSON.stringify(setting.url))
      // externals js
      let assets = []
      // app.js
      let autoModules = []
      // externals modules name
      let name = setting.name
      htmlPluginData.assets.js.forEach(function (key) {
        v.push(key)
        assets.push(key)
      })
      Object.keys(setting.importObj || {}).forEach(function (key) {
        autoModules.push(setting.importObj[key].name)
      })
      if (setting.singleSpa) {
        htmlPluginData.assets.js.length = 0
      }
      let tmp = [
        autoModules,
        assets
      ]
      htmlPluginData.html = htmlPluginData.html.replace(/<\/head>/, '<meta name="autoModules" content=\'' + JSON.stringify(tmp) + '\'></head>')
      let tmp1 = setting.singleSpa ? 'if(!window.__POWERED_BY_QIANKUN__){if(v.length>0){add(["'+setting.promise+'"])};add(v)}else{add(assetsJs)}' : 'add(v)'
      let tmp2 = setting.singleSpa ? 'window.onload=function(){if(!window.__POWERED_BY_QIANKUN__){window[\'' + name + '\'].mount()}}' : ''
      let tmp3 = '<script>let v=' + JSON.stringify(v) + ';let assetsJs = ' + JSON.stringify(assets) + ';if(!window.__POWERED_BY_QIANKUN__){(function(){function add(jsFiles){var head=document.head;return new Promise((resolve,reject)=>{var load=function(i){var file=jsFiles[i];var script=document.createElement("script");script.type="text/javascript";script.onload=function(){i++;if(i===jsFiles.length){resolve()}else{load(i)}};if(i===jsFiles.length-1){if(window.Vue){window.Vue2=window.Vue;window.Vue = undefined;}};script.src=file;head.appendChild(script)};load(0)})};' + tmp1 + '})();' + tmp2 + '};</script>'
      htmlPluginData.html = htmlPluginData.html.replace(/<\/body>/, tmp3 + '</body>')
    });
  });
};

module.exports = autoImport;