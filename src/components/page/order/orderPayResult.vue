<!-- 支付状态结果页 -->
<template>
    <div v-show="isLoadOver">
    <div :class="['pay-result-wrap',isSuccess?'pay-suc':'pay-fail']">
         <div class="top" v-if="isSuccess">
           <div class="result">
           <img src="../../../../static/img/order/pay_success.png">
           <p>支付成功</p>
           </div>
           
         </div>
         <div class="top" v-else>
           <div class="result">
           <img src="../../../../static/img/order/pay_failed.png">
           <p>支付失败</p>
           </div>
         </div>
         <div class="btn" v-if="hasTradeNo">
             <section v-if="isSuccess">
                 <p @click="jumpOrderList(1)">查看订单</p>
                 <p class="red" @click="jumpHome">返回首页</p>
             </section>
             <section v-else>
                 <p class="red" @click="rePay">重新支付</p>
                 <p @click="jumpOrderList(0)">查看订单</p>
             </section>
         </div>
         <div class="btn" v-else-if="!hasTradeNo && isFree" >
               <p @click="jumpOrderList(1)">查看订单</p>
                <p class="red" @click="jumpHome">返回首页</p>
         </div>
         <div class="btn" v-else >
                 <p class="red" @click="jumpHome">返回首页</p>
         </div>
    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      timer:null,
      isWxPay:this.$route.query.pay_type==2?true:false,//微信支付回调
      isLoadOver:false,//是否加载完毕
      price:"",//订单价格，用于重新支付使用
      isSuccess:true,
      out_trade_no:this.$route.query.out_trade_no||"",
      isFree:this.$route.query.status==1?true:false,//无需付费订单
    };
  },
  computed:{
    //检测 out_trade_no是否存在
    hasTradeNo(){
      return this.out_trade_no!=""?true:false;
    }
  },
  methods:{
      jumpHome(){
         this.$router.push("/index/home")
      },
      jumpOrderList(tab){
          this.$router.push({path:"/index/order_status",query:{tab:tab}})
      },
      //重新支付
      rePay(){
        //  this.$router.push({path:"/index/pay/",query:{n:this.out_trade_no,p:this.price}}) 
        window.location.href="/index/pay/?n="+this.out_trade_no+"&p="+this.price
      },
      //查询状态
  getStatus(callback){
  //  this.$store.commit("setLoading", true);
   let obj={
     out_trade_no:this.out_trade_no
   }
   if(this.isWxPay) obj.pay_type=2;
   this.$axios.post("/wap/Pay/payQuery",obj).then((res)=>{
        const _data=res.data;
        if(_data.code==0){
            // type：0失败 1  成功   2等待 3 轮询
            const _type=_data.data && typeof _data.data.type!="undefined"?_data.data.type:0;
            this.price=_data.data && typeof _data.data.totalAmount!="undefined"?_data.data.totalAmount:"0.0";
            callback(_type)
        }else{
            callback(0)
        }
    })
  },
  },
  
  created(){
    const that=this;
    if(this.hasTradeNo){
      this.timer=setInterval(()=>{
          this.getStatus((type)=>{
            if(type==1 || type==0){
              this.isSuccess=type==0?false:true;
              // this.$store.commit("setLoading", false);
              clearInterval(this.timer)
              this.isLoadOver=true;
            }else if(type==3){
               this.isSuccess=false;
                this.isLoadOver=true;
                // this.$store.commit("setLoading", false);
            }
          }) 
      },2000)
   }else if(this.isFree && !this.hasTradeNo){
     this.isSuccess=true;
     this.isLoadOver=true;
   }else{
     this.isSuccess=false;
     this.isLoadOver=true;
   }
  },
  mounted() {
    this.$store.commit("setLoading", false);
  },
  destroyed(){
    clearInterval(this.timer)
  },
  deactivated(){
    clearInterval(this.timer)
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.pay-result-wrap {
  position: fixed;
  transform: translateY(-50%);
  top:50%;
  width: 100%;
  left:0;
  right: 0;
  .top {
    height: pxToRem(676px);
    width: 100%;
    position: relative;
    .result{
       width: 50%;
      @include fixedCenter();
      position: absolute;
      p{
        @include tips();
      }
    }
  }
  .btn {
    margin: 0 auto;
    margin-bottom: pxToRem(70px);
    padding: 0 pxToRem(34px);
    p {
      height: pxToRem(96px);
      text-align: center;
      border: 1px solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      color: #959595;
      font-size: 16px;
      margin-bottom: pxToRem(30px);
    }
    p.red {
      background-color: #dd2727;
      color: #fff;
      border: none;
    }
  }
  &.pay-suc {
    .btn section {
      display: flex;
      justify-content: space-between;
      p {
        width: pxToRem(330px);
      }
    }
  }
}
</style>

