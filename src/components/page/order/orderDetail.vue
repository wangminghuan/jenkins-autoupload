   <!-- 订单状态 o_status :0 等待买家付款; 1:买家已付款 2:等待买家收货; 3:订单已完成;其他：订单已取消-->
<template>
 <div class="order-detail-wrap" v-if="isOver">
    <div class="status">
      <div class="top">{{list.o_status==0?'等待买家付款':list.o_status==1?'买家已付款':list.o_status==2?'等待买家收货':list.o_status==3?'订单已完成':'订单已取消'}}</div>
      <div class="right time">订单编号：{{list.o_sn}}</div>
      <div class="time" v-if="list.o_status==0||list.o_status==2">还剩 <span>{{this.surplusTime}}</span> 订单自动{{list.o_status==0?'取消':'确认'}}</div>
      <div :class="['status-img',list.o_status==1?'payment':list.o_status==2?'issued':list.o_status==3?'complete':list.o_status==4?'cancel':'wait']"></div>
    </div>
    
    <div class="adds">
      <!-- 收件人信息 -->
      <section class="ad-info">
      <div class="top"> 
        <div class="name">{{"收件人："+(typeof list.name=="string" && list.name.length>11?list.name.substring(0,11)+'...':list.name)}}</div>
        <div class="phone">{{list.phone}}</div>
      </div>
      <div class="btm">收货地址：{{list.address}}</div>
      </section>
    </div>
    <!-- 物流信息 -->
      <section class="express" v-if="list.o_status==2 ||list.o_status==3">
        <div >{{"物流公司："+list.o_logisticsCompany}}</div>
        <div >{{"运单号："+list.o_logistics}}</div>
        <div >{{"发货留言："+list.o_ship_note}}</div>
      </section>
      <div class="line24" v-else></div>
    <div class="order" >
      <div class="title">{{list.shop_name||"未知店铺"}}</div>
      <div class="list" v-for="(item,index) in list.order_goods" :key="index" @click="handleJumpDetail(item)">
        <div class="left">
          <span><img v-lazy="item.g_images" alt=""></span>
        </div>
        <div class="right">
          <div class="top">
            <h4>{{item.g_name}}</h4>
            <p>
              <span v-for="(items,indexs) in item.sku_spec" :key="indexs">
                {{items.spec}}：{{items.spec_value}}
                <i v-if="indexs!=item.sku_spec.length-1">,</i>
              </span>
            </p>
          </div>
          <div class="bottom">
            <div class="price">￥{{item.ct_price}}</div>
            <div class="num">x{{item.ct_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-num">
      <div class="order-num-box" >
        <div class="left">商品总额</div>
        <div class="right">￥{{list.o_goodsAmount}}</div>
      </div>
      <div class="order-num-box" v-if="list.o_freightAmount/1!=0">
        <div class="left">运费（快递）</div>
        <div class="right" >+￥{{list.o_freightAmount}}</div>
      </div>
      <div class="order-num-box" v-if="list.o_couponAmount/1!=0">
        <div class="left">优惠券抵扣</div>
        <div class="right">-￥{{list.o_couponAmount}}</div>
      </div>
      <div class="order-num-box" v-if="list.o_cardAmount/1!=0">
        <div class="left">购物卡抵扣</div>
        <div class="right">-￥{{list.o_cardAmount}}</div>
      </div>
    </div>
    <div class="order-all-num">支付金额: <span>￥{{list.o_payAmount}}</span></div>
    <div class="order-time">
      <h4>下单时间：{{list.o_createTime}}</h4>
      <h4 v-if="list.o_status==1||list.o_status==2||list.o_status==3">付款时间：{{list.o_payTime}}</h4>
      <h4>订单编号：{{list.o_sn}}</h4>
      <h4 v-if="list.o_status==1||list.o_status==2||list.o_status==3">交易流水号：{{list.trade_no==''?'无':list.trade_no}}</h4>
    </div>
    <div class="btm-btn" v-if="list.o_status==0 || list.o_status==2">
      <div class="sure" v-if="list.o_status==0" @click="handleJumpPayment">去付款</div>
      <div class="sure" v-if="list.o_status==2" @click="handleSure">确认收货</div>
      <div class="del"  v-if="list.o_status==0" @click="handleCancelOrder">取消订单</div>
    </div>
 </div>
</template>
<script>
export default {
  data() {
    return {
      isOver:false,//是否加载完毕
      id: this.$route.query.id,
      surplusTime: "00分00秒",
      list: {},
      timer: null,
    };
  },
  methods: {
    // 商品详情
    handleJumpDetail(item) {
      this.$router.push({
        path: "/index/detail",
        query: {
          id: item.g_id,
          gsn:item.g_sn
        }
      }); 
    },
    // 去付款
    handleJumpPayment() {
       window.location.href="/index/pay/?osn="+this.list.o_sn+"&n="+this.list.out_trade_no+"&p="+this.list.o_payAmount
      // this.$router.push({
      //   path: "/index/pay/",
      //   query: {
      //     osn: this.list.o_sn,
      //     n:this.list.out_trade_no,
      //     p: this.list.o_payAmount
      //   }
      // });
    },
    // 取消订单
    handleCancelOrder() {
      this.$dialog("是否取消该订单？取消后不可恢复！", ()=>{this.setCancelOrder(true)});
      
    },
    setCancelOrder(flag) { //有参数代表自己点击取消，完成后弹窗提示；无参数代表定时器过来，不提示
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Order/setCancel", {
          o_id: this.id
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
              this.list.o_status = 4;
              if(flag){
                this.$toast.success("订单已取消！");
              }
          }
        });
    },
    // 确认收货
    handleSure() {
      this.$dialog("是否确认收货？确认后将打款给卖家！", ()=>{this.setSure(true)});
    },
    setSure(flag) { //有参数代表自己点击确认收货，完成后弹窗提示；无参数代表定时器过来，不提示
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Order/setReceipt", {
          o_id: this.id
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
            this.getOrderList();
            if(flag){
              clearInterval(this.timer);
              this.$toast.success("订单交易成功！");
            }
          }
        });
    },
    // 倒计时
    resetTime(time) {
      let that =this;
      var time_distance = time; 
      var int_day, int_hour, int_minute, int_second;
      if(that.list.o_status==0&&time<0){
        clearTimeout(this.timer)
        this.setCancelOrder(false)
      }
      // 倒计时完 已自动收货
      if(that.list.o_status==2&&time<0){
        clearTimeout(this.timer)
        this.setSure(false)
      }
        // 天时分秒换算
        int_day = Math.floor(time_distance / 86400);
        time_distance -= int_day * 86400;
        int_hour = Math.floor(time_distance / 3600);
        time_distance -= int_hour * 3600;
        int_minute = Math.floor(time_distance / 60);
        time_distance -= int_minute * 60;
        int_second = Math.floor(time_distance / 1);
        function countDown() { 
          int_second--;
          if ((int_day+'').length<2) int_day = "0" + int_day;
          if (int_hour < 10&&(int_hour+'').length<2) int_hour = "0" + int_hour;
          if (int_minute < 10&&(int_minute+'').length<2) int_minute = "0" + int_minute;
          if (int_second < 10&&(int_second+'').length<2) int_second = "0" + int_second;
          if(int_second<0){int_minute--;int_second=59}
          if(int_minute<0){int_hour--;int_minute=59}
          if(int_hour<0){int_day--;int_hour=23}
          // 显示内容
          that.surplusTime=(that.list.o_status==0?'':int_day+'天'+int_hour+'时')+int_minute+'分'+int_second+'秒'
          // 倒计时完 已取消
          if(that.list.o_status==0&&int_minute==0&&int_second==0){
            clearTimeout(this.timer)
            that.list.o_status=4;
            this.setCancelOrder(false)
          }
          // 倒计时完 已自动收货
          if(that.list.o_status==2&&int_day==0&&int_hour==0&&int_minute==0&&int_second==0){
            clearTimeout(this.timer)
            that.list.o_status=3;
            this.setSure(false)
          }
         }
        this.timer = setInterval(countDown, 1000);
    },
    getOrderList() {
      this.$axios
        .post("/wap/Order/getDetail", {
          o_id: this.id
        })
        .then(res => {
          this.isOver=true;
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
            let obj = _data.data||{};
            this.list = obj;
            if (obj.o_status == 0 || obj.o_status == 2) {
              this.resetTime(obj.o_status==0?obj.countdown_nopay_order_cancel:obj.countdown_noreceipt_order_receipt);
            }
         }
        });
    }
  },
  created() {
    this.getOrderList();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    this.$store.commit("setLoading", false);
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";

.order-detail-wrap {
  padding-bottom: pxToRem(124px);
  $red: #ef3334;
  $white: #ffffff;
  .status {
    position: relative;
    padding: pxToRem(60px) pxToRem(24px) pxToRem(50px) pxToRem(88px);
    background: $red;
    font-size: 16px;
    color: $white;
    line-height: pxToRem(45px);
    .top {
      font-weight: 700;
      
    }
    .time{
      font-size: 12px;
      width: pxToRem(500px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    img {
      width: pxToRem(180px);
      height: pxToRem(180px);
      position: absolute;
      top: 50%;
      right: pxToRem(24px);
      transform: translateY(-50%);
    }

    .status-img{
            position: absolute;
            right: pxToRem(40px);
            top: 50%;
            transform: translateY(-50%);
            background-repeat: no-repeat;
            background-size: 100% auto;
        }
        .wait{
            background-image: url(../../../../static/img/order/wait-icon.jpg);
             width: pxToRem(126px);
             height: pxToRem(120px);
        }
        .payment{
            background-image: url(../../../../static/img/order/payment-icon.jpg);
            width: pxToRem(152px);
            height: pxToRem(138px);
        }
        .issued{
            background-image: url(../../../../static/img/order/issued-icon.jpg);
            width: pxToRem(167px);
             height: pxToRem(114px);
        }
        .complete{
            background-image: url(../../../../static/img/order/complete-icon.jpg);
            width: pxToRem(140px);
             height: pxToRem(131px);
        }
        .cancel{
             background-image: url(../../../../static/img/order/cancel-icon.jpg);
             width: pxToRem(151px);
             height: pxToRem(115px);
        }
       
  }

  .adds,.express {
    padding: pxToRem(24px);
    padding-left: pxToRem(90px);
    font-size: 14px;
    background: $white;
    color: #555555;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: pxToRem(4px);
    }
    position: relative;
    line-height: 20px;
    &::after {
    content: "";
      position: absolute;
      top: 50%;
      left: pxToRem(24px);
      transform: translateY(-50%);
       background-position: center;
       background-repeat: no-repeat;
       background-size: 100%;
    }
  }
  .line24{
    height: pxToRem(24px);
  }
  .adds::after{
    width: 18px;
    height: 18px;
    background-image: url("../../../../static/img/order/adds-icon.png");
  }
  .express::after{
    width: 20px;
    height: 20px;
    background-image: url("../../../../static/img/order/express.png");
  }
  .express{
    border-top: 1px solid #f5f5f5;
    padding-top:pxToRem(20px);
    margin-bottom:pxToRem(24px); 
  }
  .order {
    background: $white;
    .title {
      line-height: pxToRem(88px);
      padding-left: pxToRem(24px);
      font-size: 14px;
      color: #555555;
      border-bottom: 1px solid #f5f5f5;
    }
    .list {
      border-bottom: 1px solid #f5f5f5;
      padding: pxToRem(24px);
      display: flex;
      justify-content: space-between;
      .left {
        margin-right: pxToRem(24px);
        span {
          display: block;
          width: pxToRem(186px);
          height: pxToRem(186px);
          border-radius: pxToRem(14px);
          border: 1px solid #f5f5f5;
          position: relative;
          background-color: #f5f5f5;
          img {
            width: 100%;
            @include imgCenter();
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .top {
          h4 {
            font-size: 14px;
            margin-bottom: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          p {
            color: #959595;
          }
        }
        .bottom {
          color: $red;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .order-num {
    background: $white;
    padding: pxToRem(20px) pxToRem(24px);
    font-size: 14px;
    border-bottom: 1px solid #f5f5f5;
    .order-num-box {
      line-height: pxToRem(50px);
      height:pxToRem(50px);
      display: flex;
      justify-content: space-between;
      .right {
        color: $red;
      }
    }
  }
  .order-all-num {
    background: $white;
    padding: 0 pxToRem(24px);
    text-align: right;
    font-size: 14px;
    line-height: pxToRem(88px);
    margin-bottom: pxToRem(24px);
    span {
      color: $red;
    }
  }
  .order-time {
    font-size: 14px;
    background: $white;
    padding: pxToRem(20px) pxToRem(24px);
    h4{
      height: pxToRem(44px);
       line-height: pxToRem(44px);
    }
    color: #959595;
  }
  .btm-btn {
    position: fixed;
    background: $white;
    left: 0;
    bottom: 0;
    width: 100%;
    height: pxToRem(100px);
    display: flex;
    flex-direction: row-reverse;
    padding-top: pxToRem(24px);
    padding-right: pxToRem(24px);
    .sure {
      width: pxToRem(146px);
      height: pxToRem(54px);
      line-height: pxToRem(54px);
      text-align: center;
      background: $red;
      color: $white;
      font-size: 14px;
    }
    .del {
      width: pxToRem(146px);
      height: pxToRem(54px);
      line-height: pxToRem(54px);
      text-align: center;
      border: 1px solid #f5f5f5;
      margin-right: pxToRem(20px);
      font-size: 14px;
    }
    .sure,
    .del {
      border-radius: pxToRem(4px);
    }
  }
}
</style>

