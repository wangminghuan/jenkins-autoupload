   <!-- 订单状态 -->
<template>
 <div >
      <div class="order-status">
        <div class="left">订单号：<span>{{item.o_sn}}</span></div>
        <div class="right">{{item.o_status_name}}</div>
      </div>
      <div class="order-list" v-for="(items,indexs) in item.order_goods" :key="indexs">
        <div class="left">
          <img v-lazy="items.g_images" alt="">
        </div>
        <div class="right">
          <div class="top-title">{{items.g_name}}</div>
          <div class="bottom-title">
            <div class="color">
              <span v-for="(ite,inde) in items.sku_spec" :key="inde">
                  {{ite.spec}}:{{ite.spec_value}}
                  <i v-if="inde+1!=items.sku_spec.length">,</i>
              </span>
            </div>
            <div class="number">x{{items.ct_num}}</div>
          </div>
        </div>
      </div>
      <div class="order-info">共{{item.order_goods_num}}件商品&nbsp;&nbsp;实付款：<i>￥{{item.o_payAmount}}</i></div>
      <div class="order-operation">
        <!-- <div class="left">共{{item.order_goods_num}}件商品</div> -->
        <div class="right">
          <span class="text" @click="jumpOrderDetail(item.o_id)">查看详情</span>
          <span class="sure" v-if="item.o_status==0" @click="handleJumpPayment(item)">去付款</span>
          <span class="sure" v-else-if="item.o_status==2" @click="handleSure(item)" >确认收货</span>
          <span class="sure" v-else-if="item.o_status==3" @click="handleJumpComment(item)">{{item.o_judge==0?'我要评价':'已评价'}}</span>
        </div>
      </div>
 </div>
</template>
<script>
export default {
  props:{
    item:Object,
    handleJumpPayment:{
      type:Function,
      value:()=>{}
    },
    handleSure:{
      type:Function,
      value:()=>{}
    },
    jumpOrderDetail:{
      type:Function,
      value:()=>{}
    },
  },
  methods:{
    //跳转到评价
    handleJumpComment(item){
      if(item.o_judge==0){
        this.$router.push({path:"/index/comment_creat",query:{
          osn:item.o_sn,
          oid:item.o_id,
          }})
      }  
    }
  },
  created() {
    // console.log(this.item)
  },
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
    .order-status {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: pxToRem(88px);
      .right {
        color: #DD2727;
      }
    }
    .order-list {
      padding: pxToRem(24px);
      display: flex;
      justify-content: space-between;
      .left {
        min-width: pxToRem(115px);
        min-height: pxToRem(115px);
        margin-right: pxToRem(30px);
        position: relative;
        background-color: #f5f5f5;
        img {
           @include imgCenter()
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction:column;
        .top-title {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .bottom-title {
          margin-top: pxToRem(5px);
          display: flex;
          justify-content: space-between;
          .color {
            color: #959595;
          }
          .number {
            color: #959595;
          }
        }
      }
    }
    .order-info{
      text-align: right;
      line-height:pxToRem(88px);
      height: pxToRem(88px);
      font-size:14px;
      font-weight:500;
      background-color: #fff;
      border-bottom: 1px solid #f5f5f5;
      padding:0 pxToRem(24px);
      i{
        font-size:14px ;
        color: #202020;
        font-weight:bold;
      }
    }
    .order-operation {
      height: pxToRem(88px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .right {
        font-size: 12px;
        display: flex;
        justify-items: center;
        span {
          width: pxToRem(150px);
          height: pxToRem(56px);
          line-height:pxToRem(56px); 
          border:1px solid rgba(221,39,39,1);
          border-radius:pxToRem(28px);
          text-align: center;
          margin-right: pxToRem(17px);
        }
        span.text {
          border: 1px solid #f5f5f5;
          color: #1E1E1E;
        }
        span.sure {
          color: #DD2727;
          border-color:#DD2727
          // background: #dd2727;
        }
        span:last-child{
          margin-right: 0;
        }
      }
    }
</style>

