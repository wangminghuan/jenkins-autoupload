   <!-- 我的优惠券 无分页 -->
<template>
 <div class="my-coupon-wrap">
        <ul theme="1" slot="list">
              <coupon-item v-for="(item,index) in list" :item="item" :key="index"></coupon-item>
              <li v-if="noCoupon" class="no-coupon">
                <img src="../../../../static/img/my/no-coupon.png" alt="">
                <p>暂无优惠券</p>
              </li>
        </ul>
        <goTop></goTop>
 </div>
</template>
<script>
import Vue from "vue";
import couponItem from"./couponItem";
import goTop from　"../../common/goTop";
export default {
  components:{
    couponItem,
    goTop
  },
  data() {
    return {
        noCoupon:false,
        list:[],
        page: 1,
        pagesize: 10,
    };
  },
  methods:{
      getCouponList(){
          this.$axios.post("/wap/Coupon/myCouponList",{
            page:this.page,
            pagesize:this.pagesize
          })
          .then((res)=>{
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
              if(res.data.data.length<1&&this.page==1){
               this.noCoupon=true
              }
              let __data=_data.data instanceof Array?_data.data:[];
              this.list=__data;
          }
            
          })
      }
  },
  created(){
      this.getCouponList()
  },
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-coupon-wrap {
  padding-top: pxToRem(32px);
  .no-coupon {
    // display: block;
    width: 50%;
    @include fixedCenter();
    p{
      @include tips();
    }
  }
  .item {
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
      font-size: 10px;
      color: #959595;
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
  .item.unactive {
    opacity: 0.8;
    .top {
      color: #959595;
    }
  }
}
</style>

