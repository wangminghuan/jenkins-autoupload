<!-- 店铺首页 -->
<template>
     <div class="store-wrap">
        <div class="banner" ></div>
        <div class="titleName">
            <div class="left">
                <span><img :src="list.shop_logo" alt=""></span>
            </div>
            <div class="right">
              <span>{{list.shop_name}}</span>
              <em><b>综合服务</b><myRate v-model="list.merchant_star" :width="12+''" :height="12+''" :disabled="true"></myRate></em>
              </div>
        </div>
         <section class="recommend">
             <div class="title">
                <h5>新品上市</h5>
                <h6>New Arrival</h6>
             </div>
             <ul class="list-wrap">
                 <li v-for="(item,index) in list.goodsInfo" :key="index" @click="jumpDetail(item)">
                     <div class="cover"><img v-lazy="item.g_images" alt=""></div>
                     <p class="caption">{{item.g_name}}</p>
                     <p class="price"><i>￥</i><em>{{item.g_price}}</em></p>
                 </li>
             </ul>
         </section>
         <section class="introduce">
            <div class="title">
            <h5>公司简介</h5>
            <h6>Company Profile</h6>
            </div>
            <p>{{list.business_scope}}</p>
            <div class="environmental">
              <div class="img-wrap">
                <img v-lazy="list.company_environment" alt="">
              </div>
            </div>
            <div class="adds">{{list.company_address}}</div>
            <div class="businfo" @click="handleJumpBusInfo">
              <p>查看工商资质信息</p>
            </div>
         </section>
         <div class="empty-div"></div>
     </div>
</template>
<script>
import myRate from "../comment/rate";
export default {
  components:{
    myRate
  },
  props: {
    mid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: {
        goodsInfo: []
      }
    };
  },
  mounted() {
    this.$store.commit("setLoading", false);
  },
  methods: {
    handleJumpBusInfo(){
       this.$router.push({ path: "/index/homeRule", query: { id:this.mid } }); 
    },
    jumpDetail(item) {
      this.$router.push({ path: "/index/detail", query: { id: item.g_id,gsn: item.g_sn } }); 
    },
    getCategory() {
      this.$axios
        .post("/wap/Goods/getNewGoodsListByMid", {
          m_id: this.mid
        })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            this.list = _data.data.merchantInfo;
          }
        });
    }
  },
  created() {
    this.getCategory();
  }
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.store-wrap {
  .empty-div{
    height: pxToRem(100px) + pxToRem(25px) + pxToRem(90px);;
  }
  .banner {
    width: 100%;
    height: pxToRem(340px);
    background: url("../../../../static/img/store/shop-bg.jpg") no-repeat;
    background-size: 100% 100%;
  }
  .titleName {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // line-height: pxToRem(128px);
    height: pxToRem(130px);
    padding: 0 pxToRem(30px);
    background: #fff;
    margin-bottom: pxToRem(24px);
    .left {
      width: pxToRem(80px);
      height: pxToRem(80px);
      position: relative;
      span {
        width: pxToRem(80px);
        height: pxToRem(80px);
        display: block;
        position: relative;
        border: 1px solid #d5d5d5;
        background-color: #f5f5f5;
        img {
          @include imgCenter()
        }
      }
    }
    .right {
      flex: 1;
      font-size: 17px;
      padding-left: pxToRem(24px);
      display: flex;
      flex-direction: column;
      height: pxToRem(90px);
      justify-content: space-between;
      span{
        font-size:15px;
        font-weight:500;
        color:#202020;
        line-height:20px;
        // margin-top:-4px;
      }
      em{
        display: flex;
        font-size:14px;
        color:#666666;
        align-items: center;
        .rate-wrap{
          height: 16px;
        }
        b{
          margin-right: pxToRem(10px);
        }
      }
      // align-items: center;
    }
  }

  .recommend {
    background-color: #fff;
    .title {
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      padding-top: pxToRem(10px);
      &:after {
        content: "";
        position: absolute;
        width: pxToRem(60px);
        height: 2px;
        background-color: #2fb3ff;
        bottom: pxToRem(10px);
        left: 0;
        right: 0;
        margin: 0 auto;
      }
      h5 {
        margin-top: pxToRem(8px);
        line-height: pxToRem(65px);
        text-align: center;
        font-size: 16px;
        color: #353535;
      }
      h6 {
        line-height: pxToRem(32px);
        text-align: center;
        font-size: 16px;
        margin-bottom: pxToRem(26px);
        color: #959595;
      }
    }
    .list-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 0 pxToRem(30px);
      padding-bottom: pxToRem(30px);
      justify-content: space-between;
      li {
        width: pxToRem(330px);
        box-sizing: border-box;
        border: 1px solid #f5f5f5;
        margin-top: pxToRem(46px);
        padding-bottom: pxToRem(10px);
      }
      .cover {
        width: 100%;
        height: pxToRem(330px);
        position: relative;
        background-color: #f5f5f5;
        img {
          @include imgCenter()
        }
      }
      .caption {
        line-height: 20px;
        padding: 0 pxToRem(18px);
        color: #353535;
        height: 40px;
        overflow: hidden;
        margin-top: pxToRem(14px);
      }
      .price {
        color: #dd2727;
        padding: 0 pxToRem(18px);
        i {
          font-size: 10px;
        }
        em {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
  .introduce {
    background: #fff;
    margin-top: pxToRem(24px);
    .title {
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      padding-top: pxToRem(10px);
      padding-bottom: pxToRem(10px);

      &:after {
        content: "";
        position: absolute;
        width: pxToRem(60px);
        height: 2px;
        background-color: #2fb3ff;
        bottom: pxToRem(10px);
        left: 0;
        right: 0;
        margin: 0 auto;
      }
      h5 {
        margin-top: pxToRem(8px);
        line-height: pxToRem(65px);
        text-align: center;
        font-size: 16px;
        color: #353535;
      }
      h6 {
        line-height: pxToRem(32px);
        text-align: center;
        font-size: 16px;
        margin-bottom: pxToRem(26px);
        color: #959595;
      }
    }
    p {
      color: #959595;
      line-height: pxToRem(40px);
      padding: pxToRem(30px) pxToRem(24px);
    }
    .environmental {
      padding: 0 pxToRem(24px);
      height: pxToRem(460px);
      overflow: hidden;
      
      .img-wrap{
       background-color: #f5f5f5;
        height: pxToRem(460px);
        position: relative;
      }
      img {
         @include imgCenter();
        //  width:pxToRem(708px); 
      }
    }
    .adds {
      padding: pxToRem(30px) pxToRem(24px);
      padding-left: pxToRem(74px);
      line-height: pxToRem(56px);
      color: #959595;
      position: relative;
      background: url("../../../../static/img/store/adds-icon.png") no-repeat
        pxToRem(30px) pxToRem(40px);
      background-size: pxToRem(30px) pxToRem(36px);
    }
  }
  .businfo{
      height: pxToRem(90px);
      line-height:pxToRem(90px);
      background-color: #fff;
      position: relative;
      border-top:1px solid #f5f5f5;
      // padding: 0 pxToRem(22px);
      p{
        font-size:15px;
        font-weight:500;
        color:#333;
        padding-left: pxToRem(82px);
        background-image: url("../../../../static/img/store/bus.png");
        background-size: pxToRem(32px) pxToRem(32px);
        background-repeat: no-repeat;
        background-position-x: pxToRem(30px);
        background-position-y: center;
      }
      &:after{
          content: "";
          width: 10px;
          height: 10px;
          border-right: 1px solid #959595;
          border-bottom: 1px solid #959595;
          position: absolute;
          right: pxToRem(30px);
          top: 50%;
          -webkit-transform: rotateZ(-45deg) translateY(-50%);
          transform: rotateZ(-45deg) translateY(-50%);
      }
  }
}
</style>