import axios from 'axios';
import qs from "qs";
import Vue from 'vue';
import store from '../store'
import router from "../router";
import {cookie} from "../utils/utils";
import getMd5Code from "../utils/sign";
const vm=new Vue();
//获取完整签名和公共参数方法(拦截器中方法改写，暂时没有共用)
let getFullArg=(url,obj)=>{
    let _params={
        timestamp:String(new Date().getTime()).substring(0,10)
    };
    //获取token
    const _token=cookie.get("__m_token__");
    if(_token) _params.token=_token;
     //生成签名参数
    const __code=getMd5Code(url,qs.stringify({
        ..._params,
        ...obj
    }));
     const sortParams={
        sign:__code.md5,
    };
    //将原参数与签名函数再组装，生成最终参数
    const finalData=qs.stringify({
        ..._params,
        ...obj,
        ...sortParams
    })
    //将最终链接拼接返回
    const hostUrl=(window.location.protocol+"//"+window.location.host);
    return {
        url:hostUrl+(url+"?"+finalData),
        host:hostUrl,
        token:_token
      }
};
//end
//挂载原型链
Vue.prototype.getFullArg=getFullArg;
Vue.prototype.getCookie=cookie.get;
axios.interceptors.request.use(
config => {
    let _params={
        timestamp:String(new Date().getTime()).substring(0,10)
    };
    //获取token
    const _token=cookie.get("__m_token__");
    const shareid=sessionStorage.getItem("__shareid__"); //每周分享id统计，需要携带到每个请求中
    if(_token) _params.token=_token;
    if(shareid)_params.share_uid=shareid;
    //end
    if(config.data instanceof FormData){
        config.params = {
            ..._params,
            ...config.params
        }
        return config
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if(config.method === 'post') {
        let data = qs.parse(config.data)
        const allParams = qs.stringify({
            ..._params,
            ...data
        })
         //生成签名参数
         const __code=getMd5Code(config.url,allParams);
         const sortParams={
            sign:__code.md5,
        };
        //将原参数与签名函数再组装，生成最终参数
        const finalData={
            ..._params,
            ...data,
            ...sortParams
        }
        config.data = qs.stringify(finalData)

    } else if(config.method === 'get') {
        config.params = {
            ..._params,
            ...config.params
        }
    }
    return config;
},
err => {
    vm.$toast.error("请求异常，请稍候再试")
    store.commit('setLoading', false)
    return Promise.reject(err);
});
axios.interceptors.response.use(function (response) {  
    // token 已过期，重定向到登录页面  
    if (response.data.code == 100){ 
        //保世界和保险助手不跳转登录，直接进入授权页面
        (vm.$agent==1 || vm.$agent==2)?
        router.push({path:"/index/autologin",query:{
            redir:window.location.pathname+window.location.search
        }}):router.push({path:"/index/login",query:{
            redir:window.location.pathname+window.location.search
        }})
        cookie.unset("__m_token__")
    }else if(response.data.code !=0){
        vm.$toast.error(response.data.message)
     }
    return response  
}, function (error) { 
    store.commit('setLoading', false);
    vm.$toast.error("请求异常，请稍候再试")
    return Promise.reject(error)  
});
export default axios;
