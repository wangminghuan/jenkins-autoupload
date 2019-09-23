<template>
    <li :class="['coupon-item',item.cnu_type==1?'unactive':'']">
        <section class="top">
            <div class="lf">
                <h3>{{item.cn_name||"优惠券"}}</h3>
                <h6 v-if="item.cn_useType==0">无条件使用</h6>
                <h6 v-if="item.cn_useType!=0">商城购物满{{item.cn_useType}}元可用</h6>
            </div>
            <p class="rt"><span>￥</span><em>{{item.cn_faceValue}}</em></p>
        </section>
        <section class="btm" v-if="usetype=='order'"><span>{{(item.cnu_type==1?"已过期：":"有效期：")+(item.cn_startTime && item.cn_endTime?(fixTime(item.cn_startTime)+'-'+fixTime(item.cn_endTime)):'永久')}}</span><em  @click="handleClick">立即使用</em></section>
        <section class="btm" v-else><span>{{(item.cnu_type==1?"已过期：":"有效期：")+(item.cn_startTime && item.cn_endTime?(fixTime(item.cn_startTime)+'-'+fixTime(item.cn_endTime)):'永久')}}</span><em v-if="handleClick&&item.cnu_type!=1" @click="handleClick">立即领取</em></section>
    </li>
</template>
<script>
export default {
    props:{
        item:Object,
        usetype:String, //提交订单页直接使用，不是领取
        handleClick:Function
    },
    methods:{
       fixTime(time){
        //将 2018-07-26 11:11:55 修正为 2018.07.26
        const _time=typeof time=="string"?time:"0-0-0"
        let timeArr=_time.split(" ");
        let timeDate=timeArr[0]?timeArr[0]:"";
        return timeDate.split("-").join(".")
       }
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.coupon-item  {
    height: pxToRem(232px);
    width: pxToRem(690px);
    position: relative;
    background-color: #fff;
    margin: 0 auto;
    border-left: 1px solid #f5f5f5;
    border-right: 1px solid #f5f5f5;
    margin-bottom: pxToRem(32px);
    background-image: url("../../../../static/img/my/coupon.png");
    background-size: pxToRem(255px) auto;
    background-repeat: no-repeat;
    background-position-x: pxToRem(468px);
    background-position-y: pxToRem(30px);
    padding: 0 pxToRem(20px) 0 pxToRem(40px);
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: pxToRem(144px);
      color: #dd2727;
      text-overflow: ellipsis;
      overflow: hidden;
      .lf {
        flex-shrink: 1;
        overflow: hidden;
        white-space: nowrap;
        h3 {
          font-size: 18px;
          line-height: pxToRem(54px);
          height: pxToRem(54px);
        }
        h6 {
          font-size: 12px;
        }
      }
      .rt {
        flex-shrink: 0;
        span {
          font-size: 12px;
        }
        em {
          font-size: 28px;
        }
      }
    }
    .btm {
      position: absolute;
      bottom: pxToRem(20px);
      width:pxToRem(626px);
      font-size: 10px;
      color: #959595;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      span{
          flex-shrink: 1;
          white-space: nowrap;
        //   width: pxToRem(400px);
          overflow: hidden;
          text-overflow: ellipsis;
      }
      em{
        flex-shrink: 0;
        padding: 0 pxToRem(40px);
        height:32px;
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        font-weight: 700;
        border-radius: pxToRem(65px);
        background: #dd2727;
      }
    }
    &::before {
      content: "";
      background-image: url("../../../../static/img/my/border-top.png");
      background-size: 10px auto;
      background-repeat: repeat-x;
      display: block;
      position: absolute;
      width: 100%;
      height: 4px;
      left: 0;
      right: 0;
      top: -2px;
    }
    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 4px;
      left: 0;
      right: 0;
      bottom: -4px;
      background-color: #dd2727;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  .coupon-item.unactive {
    opacity: 0.8;
    .top {
      color: #959595;
    }
  }
</style>
