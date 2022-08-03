import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import '@/assets/css/reset.css';
import '@/assets/css/iconfont/iconfont.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store'
import VCharts from 'v-charts'

Vue.use(ElementUI);
Vue.use(VCharts)

Vue.config.productionTip = false;
Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue();
// 注册一个全局自定义指令 `v-authority`
Vue.directive('authority', {
  // 当被绑定的元素插入到 DOM 中时执行下方函数
  inserted: function (el) {
    // 暂时还没想好怎么写


  }
})

new Vue({
  router,
  render: h => h(App),
  store,
  created(){
    let me = this;
    // 添加请求拦截器
    let loading;
    axios.interceptors.request.use(function (config) {
      // 设置token
      config.headers.authorization = me.$store.getters.userInfo.token;
      // arr用来存放那些不需要显示loading的接口
      let arr = [ 'api/systemInfo' ];
      if(config.loading!==false && !arr.includes(config.url)){
        loading=me.$loading({fullscreen:true,background:'rgba(255,255,255,0.25)'});
      }
      return config;
    }, function (error) {
      // 对请求错误做些什么
      loading && loading.close();
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      loading && loading.close();
      // token验证失败跳到登录页
      if (response.data && !response.data.status && response.data.code == 401) {
        me.$message({
          showClose: true,
          message: response.data.msg,
          type: 'error'
        });
        me.$router.replace('/login');
        throw new Error();
      }else if(response.data.code === 400 || response.data.code === 404){
        me.$message({
          showClose: true,
          message: response.data.msg,
          type: 'error'
        });
        throw new Error();
      }else if(response.data.code === 500){
        me.$message({
          showClose: true,
          message: response.data.msg,
          type: 'error'
        });
        throw new Error();
      }
      return response.data;
    }, function (error) {
      window.console.log(error);
      // 对响应错误做点什么
      loading && loading.close();

      if ( 500 == error.response.code) {
        me.$message({
          showClose: true,
          message: error.response.msg,
          type: 'error'
        });
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  }
}).$mount('#app')
