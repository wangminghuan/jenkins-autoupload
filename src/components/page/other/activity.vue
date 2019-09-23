<!-- 列表页面和搜索结构可公用的商品单元组件 -->
<template>
    <div class="activity-template-warp" :style="actStyle">
        <div v-if="list!=''">
          <div class="banner" @click="handleJumpAct(list.activity.a_banner_url)">
            <img v-lazy="list.activity.a_banner" alt="">
          </div>
          <div class="coupon" v-if="list.activityCoupon&&list.activityCoupon.length>0">
              <div class="coupon-box" v-for="(item,index) in list.activityCoupon" :key="index">
                  <div class="left">
                      <div class="coupon-num">￥<span>{{item.cn_faceValue?item.cn_faceValue.split('.')[0]:''}}</span></div>
                      <div class="coupon-name">{{item.cn_name}}</div>
                  </div>
                  <div class="right" @click="handleReceiveClick(item.cn_id)">
                  </div>
              </div>
          </div>
          <div class="activity-box" >
              <div class="activity-name">
                  <span><i>{{list.activityGoods.ag_title}}</i></span>
              </div>
              <div class="activity-list">
                  <div class="activity-lists" @click="handleJumpDetail(items)" v-for="(items,indexs) in list.activityGoods.goodsList" :key="indexs">
                      <div class="activity-banner">
                          <img v-lazy="items.g_images" alt="">
                      </div>
                      <h4>{{items.g_name}}</h4>
                      <span>￥<i>{{items.g_price}}</i></span>
                  </div>
              </div>
          </div>
          <div class="activity-explain">
              {{list.activity.a_introduce}}
          </div>
        </div>
        <div class="no-active" v-if="noActive">
          <img src="../../../../static/img/other/no_activity.png" alt="">
          <span class="no-active-box">活动已过期</span>
        </div>
    </div>
    
</template>
<script>
export default {
  data() {
    return {
      noActive: false,
      aid: this.$route.query.aid || "",
      hasClick: false,
      list: ""
    };
  },
  computed:{
    actStyle(){
        return this.aid==22?{
          backgroundColor:"#951013"
        }:{}
    }
  },
  methods: {
    handleJumpAct(url){
     if(url && url.replace(/\s+/,'')!="") window.location.href=url;
    },
    handleReceiveClick(cn_id) {
      // window.open(url);
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Coupon/get", {
          cn_id: cn_id
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          let _data = res.data;
          if (_data.code == '0') {
            if(_data.data.code == '0'){
               this.$toast.success("领取成功"); 
            }else if(_data.data.code == '1'){
              this.$toast.error("您来晚了，优惠券已领完！");
            }else if(_data.data.code == '2'){
              this.$toast.error("您已领取过该优惠券！");
            }else if(_data.data.code == '3'){
              this.$toast.error("领取失败！");
            }else if(_data.data.code == '4'){
              this.$toast.error("该优惠券已过期！");
            }else{
              this.$toast.error("该优惠券已结束领取！");
            }
          }else{
            this.$toast.error("领取失败");
          }
          this.noActive = this.list == "" ? true : false;
        });
    },
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
    getActivityList() {
      this.$axios
        .post("/wap/activity/getActivityInfo", {
          a_id: this.aid
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          let _data = res.data;
          if (_data.code == 0) {
            this.list = _data.data;
          }
          this.noActive = this.list == "" ? true : false;
        });
    }
  },
  created() {
    this.getActivityList();
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.activity-template-warp {
  background: #8615c8;
  .banner {
    background: #ccc;
    width: 100%;
    height: pxToRem(342px);
    overflow: hidden;
    position: relative;
    background-color: #f5f5f5;
    img {
      max-width: 100%;
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: 100%;
      margin: 0 auto;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }

  .coupon {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: pxToRem(50px) pxToRem(24px) pxToRem(24px);
    .coupon-box {
      background: url(../../../../static/img/other/activity_bg.png) no-repeat;
      background-size: 100%;
      width: 49%;
      padding: pxToRem(60px) pxToRem(40px) pxToRem(36px);
      margin-top: pxToRem(30px);
      display: flex;
      justify-content: space-between;
      color: #fff;
      .left {
        width: pxToRem(162px);
        .coupon-num {
          span {
            line-height: pxToRem(80px);
            font-size: 34px;
          }
        }
        .coupon-name {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .right {
        padding-top: pxToRem(6px);
        width: pxToRem(100px);
        border-radius: 50%;
        overflow: hidden;
        @include backgroundImage();
        background-image: url("../../../../static/img/other/receive-icon.png")
      }
    }
  }
  .activity-box {
    margin-bottom: pxToRem(50px);
  }
  .activity-name {
    width: 100%;
    height: pxToRem(130px);
    span {
      display: block;
      width: pxToRem(435px);
      height: pxToRem(130px);
      margin: 0 auto;
      background: url(../../../../static/img/other/title_bg.png) no-repeat;
      background-size: 100%;
      color: #fff;
      padding-top: pxToRem(44px);
      font-size: 18px;
      color: #fef568;
      font-weight: 700;
      text-align: center;
      i {
        display: inline-block;
        overflow: hidden;
        height: pxToRem(50px);
      }
    }
  }
  .activity-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 pxToRem(24px);
    .activity-lists {
      width: pxToRem(336px);
      margin-top: pxToRem(30px);
      padding-bottom: pxToRem(10px);
      background: #fff;
      border: pxToRem(10px) solid #9c50ca;
      .activity-banner {
        width: 100%;
        height: 4.22rem;
        overflow: hidden;
        position: relative;
        background-color: #f5f5f5;
        img {
          max-width: 100%;
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          width: 100%;
          margin: 0 auto;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
        }
      }
      h4 {
        line-height: 20px;
        padding: 0 0.24rem;
        color: #353535;
        height: 40px;
        overflow: hidden;
        margin-top: 0.18667rem;
      }
      span {
        color: #dd2727;
        padding: 0 0.24rem;
        display: block;
        i {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
  .activity-explain {
    color: #fff;
    padding: pxToRem(10px) pxToRem(24px);
    padding-bottom: pxToRem(100px);
  }
  .no-active {
    position: fixed;
    width: pxToRem(300px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .no-active-box {
      text-align: center;
      display: block;
      font-size: 14px;
      padding-top: 0.2rem;
      padding-right: 0.5rem;
    }
  }
}
</style>

