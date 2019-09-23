<template>
<div class="login-wrap">
    <i class="close-icon login-close" @click="handleJumpHome"></i>
    <h6>账号登录</h6>
    <section :class="['item-wrap',step==1?'show':'hide']">
      <div v-if="step==1">
      <div class="item phone">
        <input type="tel" v-model="tel" maxlength="11" placeholder="请输入手机号"/>
        <i class="clear-icon" v-show="tel.length>0" @click.stop.prevent="handleClearInput('tel')"></i>
      </div>
      <div :class="['btn',telReg.test(tel)?'':'disable']" @click="checkeUserStatus">下一步</div>
      </div>
    </section>
    <section :class="['item-wrap',step==2?'show':'hide']">
      <div  v-if="step==2">
      <div class="item code">
        <input type="tel" v-model="code" placeholder="请输入验证码"/>
          <section :class="['send-btn',isSending?'sending':'']" @click="handleSendCode" ><i v-if="isSending">{{leftTime}}</i><i>{{sendTxt}}</i></section>
          <i class="clear-icon" v-show="code.length>0" @click.stop.prevent="handleClearInput('code')"></i>
        </div>
        <div  class="btn" @click="submitLogin">登录</div>
      </div>
    </section>
    <!-- <ul>
      <li class="item phone">
        <input type="tel" v-model="tel" placeholder="请输入手机号"/>
      </li>
      <li class="item code">
        <input type="tel" v-model="code" placeholder="请输入验证码"/>
        <section :class="['send-btn',isSending?'sending':'']" @click="handleSendCode" ><i v-if="isSending">{{leftTime}}</i><i>{{sendTxt}}</i></section>
      </li>
      <li class="btn" @click="submitLogin">登录</li>
    </ul> -->
  </div>
</template>
<script>
import {cookie} from "../../utils/utils.js"
import source from "../../utils/source.js"
export default {
  data(){
    return{
     step:0,
     isSending:false,
     leftTime:60,
     timer:null,
     tel:localStorage.getItem("__m_user_tel__")||"",
     code:"",
     type:source,
     telReg:/^1[3456789]\d{9}$/
    }
  },
  computed:{
    sendTxt(){
         return this.isSending?"秒后发送":"发送验证码"
    }
  },
  watch:{
    tel(val){
      this.tel=val.replace(/[^\d]/g,'')
    },
    code(val){
      this.code=val.replace(/[^\d]/g,'')
    }
  },
  methods:{
  //检测用户状态
  checkeUserStatus(){
    if(!this.checkPhoneNumber()){
          return;
     }
    this.$store.commit('setLoading', true);
    this.$axios.post("/wap/login/validation",{
       u_cellphone:this.tel,
       type:0,
     }).then((res)=>{
       const _data=res.data;
       if(_data.code==0){
            //0正常,1删除,2禁用
          if(_data.data.stuatus==1){
              this.$dialog(_data.data.meg,()=>{
                 this.step=2;
              })
          }else if(_data.data.stuatus==2){
             this.$alert(_data.data.meg,()=>{
                 this.$router.push("/index/home")
             })
          }else{
            this.step=2;
          }
       }else{
         this.$toast.error(_data.message)
       }
     })
     this.$store.commit('setLoading', false);
  },
  // handleJumpNext(){
  //   this.step=2;
  // },
  handleClearInput(k){
    this[k]="";
  },
  handleJumpHome(){
    if(this.step==1){
         this.$router.replace("/index/home")
    }else{
       this.step=1;
    }
      
  },
  checkPhoneNumber(){
    if(!(this.telReg.test(this.tel))){
          this.$toast.error("请输入正确的手机号！")
          return false;
    }
    return true;
  },
   handleSendCode(){
     
     if(this.isSending) return;
     this.$axios.post("/wap/Login/sendCode",{
       u_cellphone:this.tel
     }).then((res)=>{
       const _data=res.data;
       if(_data.code==0){
           this.setLeftTime();
           this.isSending=true;
           this.$toast("发送成功，请注意查收")
       }
     })
   },
   //发送验证码倒计时
   setLeftTime(){
     this.timer=setInterval(()=>{
        this.leftTime--;
        if(this.leftTime==0){
          this.isSending=false;
          this.leftTime=60;
          clearInterval(this.timer)
        }
     },1000)
   },
   getWXconfig(redirUrl){
          const finalUrl=this.getFullArg("/wap/WxChat/getCode")
          const ifr = document.createElement('iframe') // 创建iframe
          ifr.src = finalUrl.url+"&url="+ encodeURIComponent(finalUrl.host+redirUrl);// 将返回的form 放入div
          ifr.style.display="none";
          document.body.appendChild(ifr)
      },
   submitLogin(){
     if(!this.checkPhoneNumber()){
          return;
     }
     if(this.code.replace(/\s+/,'')==""){
        this.$toast.error("请输入验证码")
        return;
     }
     this.$store.commit('setLoading', true)
       this.$axios.post("/wap/Login/login",{
         u_cellphone:this.tel,
         captcha:this.code,
         u_from:source
       }).then((res)=>{
          const _data=res.data;
          this.$store.commit('setLoading', false)
          if(_data.code==0){
            // cookie 一天后失效
            cookie.set("__m_token__",_data.data.token,1)
            localStorage.setItem("__m_user_tel__",this.tel)
            this.$toast.success("登录成功！")
            this.getCartNums();//登陆后更新一次购物车数量
             const path=this.$route.query.redir;
            // if(this.type==4) {this.getWXconfig(path)};//微信获取静默授权
            setTimeout(()=>{
              this.$router.replace(path||"/index/home")
            },1000)
          }
          
       })
   }
  },
  beforeCreate(){
     document.getElementById("app").style.backgroundColor="#fff"
  },
  mounted(){
    this.$store.commit('setLoading', false);
    setTimeout(()=>{
      this.step=1;
    },200)
  },
  destroyed(){
    document.getElementById("app").style=""
  }

}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.login-wrap{
  // padding:0 pxToRem(98px);
  width: pxToRem(554px);
  margin:0 auto;
  overflow: hidden;
  .login-close{
    position: absolute;
    top:pxToRem(60px);
    right:pxToRem(50px);
  }
  .btn{
    width: 100%;
    height: pxToRem(90px);
    text-align: center;
    line-height: pxToRem(90px);
    border-radius:  pxToRem(90px);
    background: linear-gradient(#69b8fa, #3f95f6);//
    color: #fff;
    font-size: 18px;
  }
  .btn.disable{
    background: #ccc;
  }
  .clear-icon{
    width: 28px;
    height: pxToRem(64px);
    position: absolute;
    right: 4px;
    @include backgroundImage(center,center,14px,auto);
    background-image: url("../../../static/img/s-close.png");
    top:50%;
    transform: translateY(-50%);
  }
  .item-wrap{
    transition: all 0.3s;
    width: 100%;
    transform: translateX(100%);
  }
  .item-wrap.show{
    transform: translateX(0);
  }
  // .item-wrap.hide{
  //   transform: translateX(100%);
  // }
  // .item-wrap.leave{
  //   transform: translateX(-100%);
  // }
  .item{
    display: flex;
    height:pxToRem(80px) ;
    // line-height:pxToRem(80px) ;
    border-bottom: 1px solid #d5d5d5;
    background-repeat: no-repeat;
    padding-left:pxToRem(48px); 
    background-position:0 center; 
    margin-bottom: pxToRem(48px); 
    color: #353535;
    display: flex;
    align-items: center;
    font-size: 14px;
    position: relative;
    
    input{
      height: 20px;
      line-height: 20px;
      // font-size: 14px;
    }
  }
  .phone{
    background-image: url("../../../static/img/login/phone.png");
    background-size: 14px auto;
    input{
      width:pxToRem(350px)  
    }
    
  }
  .code{
     background-image: url("../../../static/img/login/code.png");
     background-size: 15px auto;
     margin-bottom: pxToRem(84px);
     input{
      width:pxToRem(280px);
      margin-right:pxToRem(40px); 
    }
    .clear-icon{
      right: pxToRem(180px);
    }
    .send-btn{
      color: #5bb0f9;
      position: relative;
      text-align: right;
      width: pxToRem(170px);
      
      &::before{
        content: "";
        height:pxToRem(40px) ;
        width: 2px;
        background-color:#e5e5e5;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        left:0; 
      } 
    }
    .sending{
      color: #959595;
    }
  }
  h6{
    line-height: pxToRem(195px);
    font-size: 22px;
  }
}
</style>


