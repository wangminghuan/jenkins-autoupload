<!--
  自动登录页面
-->
<template>
  <div class="autologin-wrap" v-show="isShow">
    <section class="login-center">
      <div :class="['logo','logo-'+type]"></div>
      <p v-if="isReLogin">重新授权到极夫特商城</p>
      <p v-else>即将授权登录到极夫特商城</p>
      <div class="loading"></div>
    </section>
  </div>
</template>

<script>
import phone from "../../utils/author.js";
import type from "../../utils/source.js"
import {cookie} from "../../utils/utils.js"
export default {
  data(){
    return{
      isShow:false,
      tel:phone,
      type:type,
      isAllowBack:false,//是否允许离开页面 防止用户在未清求完毕就离开
      isReLogin:false, //是否重新授权 被删除用户
    }
    
  },
  methods:{
     //检测用户状态
  checkeUserStatus(){
    this.$store.commit('setLoading', true);
    this.$axios.post("/wap/login/validation",{
      u_cellphone:this.tel,
       type:1,
    }).then((res)=>{
       const _data=res.data;
       if(_data.code==0){
            //0正常,1删除,2禁用
          if(_data.data.stuatus==1){
              this.isShow=true;
              this.isReLogin=true;
              this.requireAutoLogin();
          }else if(_data.data.stuatus==2){
            // 禁用的无法进入页面，点击按钮关闭webview
             this.$alert(_data.data.meg,()=>{
                if(typeof CustomJS !="undefined"){
                    //1助手 2保世界 3H5 4 微信
                    if(this.type==1){
                       this.$ios ? CustomJS.closeWeb() : CustomJS.closeCurrentPage();
                    }else if(this.type==2){
                        CustomJS.closeWeb("")
                    }
                }
             })
          }else{
            this.requireAutoLogin();
          }
       }else{
         this.$toast.error(_data.message)
       }
       this.$store.commit('setLoading', false);  
    })
  },
    //自动登录
    requireAutoLogin(){
      this.$store.commit('setLoading', true); 
      this.$axios
      .post('/wap/login/autoLogin',{
        u_cellphone:this.tel,
        u_from:this.type
      })
      .then(res=>{
        const _data = res.data;
        this.$store.commit('setLoading', false); 
        if(_data.code==0){
             // cookie 一天后失效
            cookie.set("__m_token__",_data.data.token,1)
            localStorage.setItem("__m_user_tel__",this.tel)
            sessionStorage.setItem("__has_authorized_"+this.tel+"__", true)
            const path=decodeURIComponent(this.$route.query.redir);
            this.isAllowBack=true; //请求完毕 允许离开该页面
            if(_data.data.step == 1){ //需要
              //活动页为静默授权，不需要显示
              this.isShow= typeof path=="string" && path.match("ban_activity")?false: true;
              setTimeout(()=>{
                  this.$router.replace(path||"/index/home")
                },1000);
            }else{
                this.$router.replace(path||"/index/home")
            }
            this.getCatNums();
        }
      }).catch((err)=>{
            this.$store.commit('setLoading', false); 
            this.isAllowBack=true;
            this.$router.replace(path||"/index/home")
        })
    }
  },
  created(){
    if(type==3){
       this.$router.replace("/index/home")
    }else{
      //自动登录前先删除原始cookie
       cookie.unset("__m_token__", "/index");
       this.checkeUserStatus()
    }
    
  },
  //路由离开守卫
  beforeRouteLeave(to, from, next) {
    if(this.isAllowBack){
        next()
    }else{
      next(false)
    }
  },
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
  .autologin-wrap{
    width:100%;
    height: 100%;
    background-color: rgba(98,98,98,0.5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .login-center{
      margin-top:-100px;
      width:pxToRem(495px);
      height: pxToRem(260px);
      background:#fff;
      border-radius: 10px;
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;
      .logo{
        width:45px;
        height: 45px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        margin-top:pxToRem(30px);
      }
      //助手
      .logo-1{
          background-image: url('../../../static/img/login/logo-1.jpg');
      }
      // 保世界
      .logo-2{
          background-image: url('../../../static/img/login/logo-2.jpg');
      }
      p{
        color:#555555;
        font-size: 16px;
        margin-top:pxToRem(30px);
      }
      .loading{
        width: 2px;
        height: 2px;
        border-radius: 50%;
        animation: load-effect 1s infinite linear;
        position: absolute;
        bottom:40px;
        left: 0;
        right: 0;
        margin:0 auto;
      }
      @keyframes load-effect {
        100%{
          box-shadow: -3em 2em 0 .5em #959595, 0 2em 0 0 #e5e5e5, 3em 2em 0 -.5em #e5e5e5;
        }
        75%{
          box-shadow: -3em 2em 0 0 #959595, 0 2em 0 -.5em #e5e5e5, 3em 2em 0 0 #e5e5e5;
        }
        50%{
          box-shadow: -3em 2em 0 -0.5em #959595, 0 2em 0 0 #e5e5e5, 3em 2em 0 .5em #e5e5e5;
        }
        25%{
          box-shadow: -3em 2em 0 0 #959595, 0 2em 0 .5em #e5e5e5, 3em 2em 0 0 #e5e5e5;
        }
        0%{
          box-shadow: -3em 2em 0 .5em #959595, 0 2em 0 0 #e5e5e5, 3em 2em 0 -.5em #e5e5e5;
        }
      }
    }
  }
</style>

