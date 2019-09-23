import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './http/http'
import SvgIcon from 'vue-svgicon'
import Navigation from 'vue-navigation'
import base64url from "base64url";
import { Confirm, Alert, Toast} from 'vue-ydui/dist/lib.px/dialog';
import VueLazyload from 'vue-lazyload'
Vue.use(Navigation, {router, store})
Vue.use(VueLazyload, {  
  preLoad: 1.3,  
  error: require("../static/img/lazy-default.png"),  
  loading:require("../static/img/lazy-default.png"),   
  attempt: 1  
}); 
//svg 生成
Vue.use(SvgIcon, {
  tagName: 'svgicon'
})
Vue.prototype.$axios = axios;
// 动态设置publicPath,模板中 window.resourceBaseUrl为最终结果（模板中一定要配置好window.resourceBaseUrl的值）
// 也可以将这串代码注释掉通过修改webpack.prod.conf文件中的publicPath来实现同样的效果
__webpack_public_path__ = window.resourceBaseUrl;
//全局方法

Vue.prototype.$toast =(mes)=>Toast({
  mes:mes,
  timeout:1000
});
Vue.prototype.$toast.success =(mes)=>Toast({
  mes:mes,
  timeout:1000,
  icon: 'success'
});
Vue.prototype.$toast.error =(mes)=>Toast({
  mes:mes,
  timeout:1000,
  icon: 'error',
});
Vue.prototype.$dialog=(mes,callback,title)=>Confirm({
  title: title||'提示',
  mes: mes,
  opts: () => {
      callback()
  }
});
Vue.prototype.$alert=(mes,callback)=>Alert({
  mes: mes,
  callback:callback
});
const _ua=window.navigator.userAgent.toLowerCase();
const _ios=_ua.match("iphone")?true:false;
//urlbase64加密解密方法 https://www.npmjs.com/package/base64url
Vue.prototype.$base64url=base64url;
// 3H5，1助手，2保世界，
Vue.prototype.$agent=_ua.match("zhushou browser")?1:_ua.match("zhongchuang")?2:3
Vue.prototype.$isWX=(/micromessenger\//ig.test(_ua))?true:false; //是否是微信
Vue.prototype.$ios=_ios;
Vue.prototype.$tips="-- 已经到底了 --";
Vue.prototype.$setTitle=(title)=>{
  if(typeof CustomJS!=="undefined" && _ios && CustomJS.setTitle){
    CustomJS.setTitle(title)
  }else{
    document.title = title
  }
  
}
//购物车数量更新
Vue.prototype.getCartNums=()=> {
      axios.post("/wap/Cart/getCartNum")
      .then((res)=>{
          const _data=res.data;
          if(_data.code==0){
            store.commit('setCartNums',parseInt(_data.data.cart_num))
          } 
      })  
};
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})