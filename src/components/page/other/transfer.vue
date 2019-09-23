<!-- 商城购物卡转赠页面 -->
<template>
  <div class="card-trans-bg">
    <img class="top"
         src="../../../../static/img/other/transfer-1.jpg">
    <p class="card-info"><b>{{"您的好友："+urlData.tel+" 送你价值"}}</b><i>{{urlData.price}}</i><b>{{"元的购物卡"}}</b></p>
    <div class="mid">
      <img class="left-img" src="../../../../static/img/other/transfer-3.png">
      <div class="user-input">
        <img class="top-img" src="../../../../static/img/other/transfer-2.png">
        <div class="item tel">
          <input type="tel"
                 v-model="tel"
                 maxlength="11"
                 placeholder="请输入手机号" />
        </div>
        <p class="tel-tips">该领取手机号将作为登录极夫特商城账户</p>
        <div class="item code">
          <div class="code-wrap">
          <input type="tel"
                 v-model="code"
                 placeholder="请输入验证码" />
          </div>
          <section :class="['send-btn',isSending?'sending':'']"
                   @click="handleSendCode"><i v-if="isSending">{{leftTime}}</i><i>{{sendTxt}}</i></section>
        </div>
        <div class="btn"
             @click="handleClick">立即领取</div>
      </div>
      <img class="btm-img" src="../../../../static/img/other/transfer-4.png">
    </div>
    <ul class="rules">
      <ol>活动规则</ol>
      <li>1.使用此卡请微信关注“极夫特商城”公众号使用领卡的手机号登陆进行购买。</li>
      <li>2.获赠的极夫特商城购物卡请于{{urlData.time}}前使用，过期失效。</li>
      <li>3.购物卡可用于购买商城所有商品，可全额抵扣。不设找零，不兑现金且购买商品不开具相关发票。</li>
      <li>4.该购物卡使用说明及相关规定的最终解释权归极夫特电子商务所有，如有疑问可致电0371-88865188。</li>
    </ul>
    <div class="pop-box" v-show="isShowPop">
      <div class="p-mask"></div>
      <div class="p-box" v-if="isSuccess">
        <div class="close" @click.stop="isShowPop=false"></div>
        <div class="title">
          <p>领取成功</p>
          <!-- <span>您可任选以下一种方式进行消费！</span> -->
        </div>
        <div class="p-tips">
            <!-- <em>方式一：下载保世界APP</em>
            <b>选购商品结算时，可立即使用转赠卡！</b>
            <section @click="handleDownApp"
                     class="p-btn">立即下载</section> -->
            <em>关注极夫特商城公众号</em>
            <img src="../../../../static/img/gzh-ecode.jpg">
            <b v-show="$isWX"><i style="color:#cf261f">{{jumpTime}}s</i>后自动跳转至极夫特商城公众号关注页面</b>
        </div>
      </div>
       <div class="p-box" v-else>
         <div class="close" @click.stop="isShowPop=false"></div>
         <div class="title">
          <p>领取失败</p>
          <span>{{errMsg}}</span>
          <!-- <span v-if="errMsg" style="font-size:12px">{{"原因："+errMsg}}</span> -->
        </div>
          <div class="p-tips">
            <section class="p-btn"  @click.stop="handleReSubmit">重新领取</section>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      timers:null,
      jumpTime:2,
      isShowPop:false,//是否展示弹窗
      errMsg: "",
      isSuccess: false,//领取是否成功
      step: 0,
      isSending: false,
      leftTime: 60,
      timer: null,
      code: "",
      tel: "",
      telReg: /^1[3456789]\d{9}$/,
      height: window.innerHeight
    }
  },
  computed: {
    sendTxt () {
      return this.isSending ? "秒后发送" : "发送验证码"
    },
    urlData () {
      const str = this.$route.query._key || "";
      let urlStr = this.$base64url.decode(str);
      const result = {};
      if (urlStr != "") {
        urlStr.split("&").map((item) => {
          let val = item.split("=")
          if (val[0]) result[val[0]] = val[1] || "";
        })
      }
      return result
    }
  },
  watch: {
    tel (val) {
      this.tel = val.replace(/[^\d]/g, '')
    },
    code (val) {
      this.code = val.replace(/[^\d]/g, '')
    }
  },
  methods: {
    handleReSubmit(){
      this.code="";
      this.isShowPop=false;
    },
    handleDownApp () {
      window.location.href = !!window.location.port?"http://zc.dev.bxd365.com/html/download/index":"https://service.inswindows.com/html/download/index"
    },
    checkPhoneNumber () {
      if (!(this.telReg.test(this.tel))) {
        this.$toast.error("请输入正确的手机号！")
        return false;
      }
      return true;
    },
    //发送验证码倒计时
    setLeftTime () {
      this.timer = setInterval(() => {
        this.leftTime--;
        if (this.leftTime == 0) {
          this.isSending = false;
          this.leftTime = 60;
          clearInterval(this.timer)
        }
      }, 1000)
    },
    handleSendCode () {
      if (this.isSending) return;
      if(!this.checkPhoneNumber()) return;
      this.$axios.post("/wap/Login/sendCode", {
        u_cellphone: this.tel
      }).then((res) => {
        const _data = res.data;
        if (_data.code == 0) {
          this.setLeftTime();
          this.isSending = true;
          this.$toast("发送成功，请注意查收")
        }
      })
    },
    handleSubmit(){
      this.$store.commit("setLoading", true);
       this.$axios.post("/wap/Login/getCard", {
        u_sn: this.urlData.sn || "",
        u_cellphone: this.tel,
        cdu_id: this.urlData.id || "",
      })
        .then((res) => {
          const _data = res.data;
          this.$store.commit("setLoading", false);
          if (_data.code == 0) {
              this.isSuccess=true;
              this.isShowPop=true;
              if(this.$isWX){
                this.timers=setInterval(()=>{
                    this.jumpTime>=1?this.jumpTime--:0;
                    if(this.jumpTime==0){
                      clearInterval(this.timers)
                      window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzOTgxMzIzMw==&scene=126&bizpsid=0#wechat_redirect"
                    }
                },1000)
              }
          }
        })
    },
    handleClick () {
      const tel = this.tel.replace(/\s+/, "");
      const code = this.code.replace(/\s+/, "");
      if (tel == "") {
        this.$toast("请输入手机号")
        return
      }
      if (code == "") {
        this.$toast("请输入验证码")
        return
      }
      this.$store.commit("setLoading", true);
      this.$axios.post("/wap/login/verifyCaptcha", {
        u_cellphone: tel,
        captcha: code,
      }).then((res)=>{
          const _data = res.data;
          this.$store.commit("setLoading", false);
          if (_data.code == 0) {
               this.handleSubmit();
          }else{
            this.$toast(_data.message)
          }
      })
    },
  },
  created () {
    this.$store.commit("setLoading", false);
    console.log(this.urlData)
  },
  mounted () {
    setTimeout(() => {
      const _height = this.$refs.innerWrap && this.$refs.innerWrap.clientHeight ? this.$refs.innerWrap.clientHeight : 0;
      if (_height > this.height) {
        this.height = _height;
      }
    }, 1000)
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.card-trans-bg {
  width: 100%;
  background-color: #cf261f;
  // height: 100%;
  // background-image: url("./img/bg.jpg");
  .tel-tips{
    color: #fc9b96;
    font-size: 12px;
    padding-left:pxToRem(70px); 
    line-height:30px; 
  }
  .card-info {
    color: #ffeec0;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 12px;
    margin-top:12px;
    b{
      display: inline-block;
      
    }
    i {
      color: #ffd800;
      font-size: 16px;
      display: inline-block;
      font-weight: bold;
    }
  }
  .mid {
    margin: 0 auto;
    display: block;
    width: pxToRem(750px);
    height: pxToRem(625px);
    position: relative;
  }
  .top {
    margin: 0 auto;
    display: block;
  }
  .btm-img{
       width: 100%;
      display: block;
      margin-top:pxToRem(-68px);
    }
    .left-img{
      position:absolute;
      left: 0;
      display: block;
      width:pxToRem(41px); 
      top:pxToRem(155px);
    }
  .user-input {
    width: pxToRem(698px);
    background-color: #e6342c;
    border-radius: 4px;
    margin: 0 auto;
    padding-top: pxToRem(34px);
    padding-bottom: pxToRem(68px);
    .top-img{
      width: pxToRem(436px);
      display: block;
      margin:0 auto;
      margin-bottom: pxToRem(40px);
    }
    
    .item {
      border-radius: 6px;
      width: pxToRem(586px);
      margin: 0 auto;
      overflow: hidden;
      height: pxToRem(80px);
     
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      font-size: 14px;
      padding: 0 pxToRem(40px);
    }
    .item input {
      display: block;
      width: 100%;
       line-height: 20px;
      height:  20px;
    }
    .item.code{
      margin-bottom: pxToRem(30px);
    }
    .code .code-wrap {
      display: block;
      overflow: hidden;
      width: pxToRem(300px);
      height: pxToRem(80px);
      display: flex;
      align-items: center;
       
      // padding: 0 pxToRem(40px);
    }
    .send-btn {
      color: #e6342c;
    }
    .btm {
      margin-bottom: 3.2vh;
    }
    .btn {
      width: 100%;
      height: pxToRem(84px);
      width: pxToRem(586px);
      margin: 0 auto;
      line-height: pxToRem(84px);
      font-size: 16px;
      color: #353535;
      text-align: center;
      font-weight: bold;
      border-radius: 6px;
      background-color: #ffd800;
      box-shadow: 0 6px 8px 0px #b8160f;
    }
  }
  .rules {
    padding: 0 pxToRem(36px);
    color: #fff;
    font-size: 12px;
    margin-top: pxToRem(-40px);
    padding-bottom: pxToRem(50px);
    li {
      line-height: 22px;
    }
    ol {
      text-align: center;
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
  .p-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
  }
  .p-box {
    position: fixed;
    width: pxToRem(502px);
    top: 45%;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translateY(-50%) scale(1.1);
    .title {
      height: pxToRem(235px);
      background-image: url("../../../../static/img/other/pop-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      text-align: center; 
      padding-top:pxToRem(50px);
      p{
        font-size: 30px;
        color:#efe71a;
        font-weight: bold;
        line-height:40px; 
      }
      span{
       font-size: 15px;
        color:#efe71a;
        line-height:24px;
        display: block; 
      }
    }
    .close{
      width: pxToRem(60px);
      height: pxToRem(60px);
      position: absolute;
      top:pxToRem(-105px);
      right: pxToRem(-15px);
       background-image: url("../../../../static/img/other/close.png");
      background-repeat: no-repeat;
      background-size: pxToRem(60px) pxToRem(60px);
      background-position: center;
    }
    .p-btn{
      height: pxToRem(75px);
      width: pxToRem(262px);
      line-height:pxToRem(75px);
      font-size: 16px;
      color: #fff;
      background-color:  #e62e27;
      border-radius:  pxToRem(75px);
      margin: 0 auto;
    }
    .p-tips {
      background-color: #fff;
      text-align: center;
      padding:pxToRem(40px) 0 pxToRem(60px) 0; 
      margin-top: -2px;
      text-align: center;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      em{
        font-size: 14px;
        color:#333;
        line-height:24px;  
        display: block;
        font-weight: bold;
      }
      b{
        font-size: 10px;
        color:#333;
        line-height:18px; 
        display: block; 
        margin-top:10px;
      }
      .p-btn{
        margin-top:pxToRem(26px);
        margin-bottom:pxToRem(32px);
      }
      img{
        width:pxToRem(160px);
        height: pxToRem(160px);
        display: block;
        margin:0 auto;
        margin-top:pxToRem(8px);

      }
    }
    
  }
}
</style>


