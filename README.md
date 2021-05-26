<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: mayako
 * @Date: 2019-11-20 10:41:02
 * @LastEditors: mayako
 * @LastEditTime: 2021-05-26 14:31:35
 -->
# babel-plugin-auto-import
用于支持externals项自动注入依赖，支持singleSpa依赖复用及自启动

##配置说明

```javascript
// 模块名
  name: 'vueB',
// 是否是singleSpa
  singleSpa:true,
// 需要分离的模块及对应地址
  noMount: false,
// 是否自动mount
  importObj:{
    'vue': {name:'Vue',url:'https://cdn.bootcss.com/vue/2.6.10/vue.min.js'},
    'vuex': {name:'Vuex',url:'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js'},
    'vue-router': {name:'VueRouter',url:'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js'},
  }
```
