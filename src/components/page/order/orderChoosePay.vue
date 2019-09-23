<!-- 选择支付方式 -->
<template>
    <div class="choose-pay-wrap">
      <div class="times">
          <section>
              <p>您还有<i>{{minute}}</i>分<i>{{second}}</i>秒时间进行支付</p>
              <p>超时将取消订单</p>
          </section>
          </div>
       <div class="price"><span>订单金额</span><em>￥{{money}}</em></div>
       <div class="method">
            <p class="item">支付方式</p>
            <p class="item wx-icon" @click="handleClick(2)"><b>微信支付</b><span :class="['common-checkbox-icon',pay==2?'checked':'']" ><i></i></span></p>
            <p class="item alipay-icon" @click="handleClick(1)" v-if="!isWX"><b>支付宝支付</b><span :class="['common-checkbox-icon',pay==1?'checked':'']" ><i></i></span></p>
       </div>
       <div :class="['submit-btn',{'disable':!canSubmit}]" @click="handleSubmit" >确定支付</div>
    </div>
</template>
<script>
import type from "../../../utils/source.js";
export default {
  data() {
    return {
      money: this.$route.query.p,
      trade_no:this.$route.query.n, //trade_number
      osn:this.$route.query.osn, //osn
      pay: "2",
      //是否在微信中
      isWX:type==4?true:false,
      timer:null,
      minute:"0",
      second:"0",
      canSubmit:true,
      openid:sessionStorage.getItem("__openid__")
    };
  },
  methods:{
      // 倒计时
    resetTime(time) {
      let that =this;
      let time_distance = time; 
      let int_minute, int_second;
      int_minute = Math.floor(time_distance / 60);
      time_distance -= int_minute * 60;
      int_second = Math.floor(time_distance / 1);
      const countDown=()=> { 
          if(int_minute<=0 && int_second<=0){
              //取消订单
                clearInterval(this.timer);
                this.canSubmit=false;
                this.cancleOrder();
            }else{
                int_second--;
                if(int_second<0){int_minute--;int_second=59}
            }
            return {
                minute:int_minute,
                second:int_second
            }
         }
        this.timer = setInterval(()=>{
            let obj=countDown();
            this.minute=obj.minute;
            this.second=obj.second;
        }, 1000);
    },
      handleClick(val){
          this.pay=val
      },
      cancleOrder(){
          this.$store.commit("setLoading", true);
          this.$axios.post("/wap/Order/setCancelByTradeNo",{
              out_trade_no:this.trade_no
          })
          .then((res)=>{
              const _data=res.data;
              if(_data.code==0){
                this.$toast.error("订单已取消")
                setTimeout(()=>{
                    // window.history.go(-1) //只要倒计时没有了 订单取消都要跳转到订单列表页面
                    this.$router.push({path:'/index/order_status',query:{tab:'-1'}})
                },2000)
              }
            this.$store.commit("setLoading", false);
          })
      },
      handleSubmit(){
          if(!this.canSubmit) return;
          this.$store.commit("setLoading", true);
          let obj={
              type:this.pay,
          }
          //微信支付重置安卓reffer设置
          if(this.pay==2 && typeof CustomJS!=="undefined" && CustomJS.configWxReferer){
                CustomJS.configWxReferer(1)
          }
          //微信内置浏览器内支付需多加一个参数
          if(this.isWX) obj.weixinType=1;
          if(this.trade_no && !this.osn) obj.out_trade_no=this.trade_no;
          if(this.osn) obj.o_sn=this.osn;
          if(this.openid) obj.openid=this.openid;
          this.$axios.post("/wap/Pay/pay",obj)
          .then((res)=>{
              const _data=res.data;
              const that=this;
              if(_data.code==0){
                 //微信内置浏览器支付，走微信内置对象唤起支付
                if(this.isWX){
                    if(typeof WeixinJSBridge != "undefined"){
                        WeixinJSBridge.invoke(
                                'getBrandWCPayRequest',_data.data,
                                function(res){
                                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                                    //成功
                                    that.$router.replace("/index/order_pay_result?status=1")
                                } else{
                                   //失败
                                   that.$router.replace("/index/order_pay_result")
                                }
                            }); 
                    }else{
                        //失败
                         that.$router.replace("/index/order_pay_result")
                    }
                    //微信支付逻辑，跳转中间页
                }else if(this.pay=="2"){
                   window.location.href=_data.data.mweb_url
                }else if(this.pay=="1"){
                    //  支付宝支付逻辑，返回的是一个表单，拿到后直接塞到页面中运行表单即可
                    const div = document.createElement('div') // 创建div
                    div.innerHTML = _data.data[0] // 将返回的form 放入div
                    div.style.display="none";
                    document.body.appendChild(div)
                    document.forms[0].submit()
                    } 
                }
                this.$store.commit("setLoading", false);
          })
      },
      getTime(){
          this.$axios.post("/wap/order/getNopayOrdercancelByTradeNo",{
              out_trade_no:this.trade_no
          })
          .then((res)=>{
              const _data=res.data;
              if(_data.code==0){
                  let times=parseInt(_data.data.countdown_nopay_order_cancel)>0?parseInt(_data.data.countdown_nopay_order_cancel):0;
                  this.resetTime(times)
              }
              this.$store.commit("setLoading", false);
          })
      }
  },
  created(){
        this.getTime();  
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.choose-pay-wrap {
  font-size: 14px;
  color: #323333;
  .times{
      height: pxToRem(160px);
      background-image: url("../../../../static/img/other/times.jpg");
       background-repeat: no-repeat;
       background-size: auto 100%;
       background-position: 0 center;
       section{
           width: 100%;
           padding-left:pxToRem(340px); 
           padding-top:pxToRem(40px);
           height: pxToRem(160px);
       }
       p{
         line-height: 24px;
         color:#353535;
         font-size: 14px;
       }
       i{
           color: #dd2727;
       }
  }
  .price {
    line-height: pxToRem(90px);
    padding: 0 pxToRem(30px);
    background-color: #fff;
    margin-bottom: pxToRem(26px);
    display: flex;
    justify-content: space-between;
    em{
        color: #dd2727;
    }
  }
  .method {
    padding: 0 pxToRem(30px);
    background-color: #fff;
    .item{
        display: flex;
        justify-content: space-between;
        height: pxToRem(120px);
        position: relative;
        align-items: center;
        &::after{
            content: "";
            width: pxToRem(750px);
            position: absolute;;
            bottom: 0;
            left: pxToRem(-30px);
            height: 1px;
            background-color: #f8f8f8;
        }
    }
    .wx-icon,.alipay-icon{
      background-position-y:center;
      background-repeat: no-repeat;
      background-position-x: 0;
      background-size: 28px 28px;
      padding-left: 36px; 
    }
    .wx-icon{
        background-image: url("../../../../static/img/other/wx-icon.png");
    }
    .alipay-icon{
        background-image: url("../../../../static/img/other/alipay-icon.png");
    }
  }
  
  .submit-btn{
      width: 100%;
      height: pxToRem(100px);
      line-height: pxToRem(100px);
      font-size: 16px;
      color: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      margin:0 auto; 
      background-color: #dd2727;
      text-align: center;
  }
  .disable{
      background-color: #888;
  }
}
</style>

