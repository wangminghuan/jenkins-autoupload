<!-- 商品详情 不含底部菜单部分 -->
<template>
     <div class="detail-wrap common-scroll-wrap">
       <section class="common-scroll-view" id="detailView">
         <section class="swiper">
             <h4 class="rightTips">已售：{{renderData.goods ?renderData.goods.g_salenum:''}}</h4>
             <yd-slider autoplay="3000">
                <yd-slider-item v-for="(item,index) in renderData.imgArr" :key="index">
                        <img :src="item" @click="handleShowPreview(index)">
                </yd-slider-item>
            </yd-slider>
         </section>
         <section class="info">
            <div class="caption">
                <h2>￥{{renderData.goods.minSkuPrice}}<span style="display:none">市场价:<b>{{renderData.goods.g_price}}</b></span></h2>
                <h4>{{renderData.goods.g_name}}</h4>
                <p v-if="renderData.goods.g_subtitle">{{renderData.goods.g_subtitle}}</p>
            </div>
            <div class="product-info">
                <div class="product-box discount" @click="showCouponPop=true" v-if="renderData.goods_coupon.length>0">
                    <div class="left">
                        <span>优惠券</span>
                    </div>
                    <div class="center"><i v-for="(item,index) in renderData.goods_coupon" :key="index">{{item.cn_name}}</i></div>
                    <div class="right">领取</div>
                </div>
                <div class="product-box offer" v-if="renderData.goods.shop_name" @click="handleJumpStore(renderData.goods.m_id)">
                    <div class="left">
                        <span>服务商</span>
                    </div>
                    <div class="center"><span>此商品由 </span> {{renderData.goods.shop_name}} <span> 提供</span></div>
                </div>
                <div class="product-box product arrow-icon" @click="handleClickShowSpec">
                    <div class="left">
                        <span>产品规格</span>
                    </div>
                    <div class="center right-ellipic" v-if="renderData.initSpecName" >已选 {{renderData.initSpecName.join(" ")}}</div>
                </div>
                <div class="product-box give" v-if="renderData.goods.delivery_limit!=''">
                    <div class="left">
                        <span>配送说明</span>
                    </div>
                    <div class="center">{{renderData.goods.delivery_limit}}</div>
                </div>
            </div>
         </section>
         <!-- 用户评价 -->
         <section class="comment-wrap" >
           <section v-if="newUserComment.ogj_id">
             <h6>商品评价({{newUserComment.total||0}})</h6>
           <comment-item :itemData="newUserComment" :type="3">></comment-item>
           <section class="jump-btn-wrap"><div @click="handleJumpAllComment" class="jump-btn">查看全部评价</div></section>
           </section>
           <section v-else class="empty-comment">暂无评论</section>
         </section>
         <section class="desc-wrap">
            <h1 class="titl">商品详情</h1>
            <div class="content ql-editor" v-html="renderData.goods.g_description"></div>
         </section>
         </section>
         <!-- 优惠券 -->
         <yd-popup v-model="showCouponPop"  position="bottom" height="10.8rem" class="pop-coupon-box">
              <div class="title-name"><span>店铺优惠券</span><i class="close-icon" @click.stop="showCouponPop=false"></i></div>
              <div class="common-scroll-wrap">
              <ul class="common-scroll-view" v-if="renderData.goods_coupon && renderData.goods_coupon.length>0">
                   <coupon-item v-for="(item,index) in renderData.goods_coupon" :item="item" :handleClick="()=>getCoupon(item)" :key="index"></coupon-item>
              </ul>
              <ul v-else class="pop-default common-scroll-view"><img src="../../../../static/img/my/no-coupon.png"><p>暂无优惠券</p></ul>
              </div>
              <div class="complete">
                  <span @click.stop="showCouponPop=false">完成</span>
              </div>
         </yd-popup>
         <div class="preview-box" v-if="isShowPreview">
        <div class="head"><span>{{(previewIndex+1)+"/"+renderData.imgArr.length}}</span><p class="close" @click.stop="isShowPreview=false">关闭</p></div>
        <yd-slider :index="initIndex" :callback="previewCallback" :show-pagination="false">
                <yd-slider-item v-for="(item,index) in renderData.imgArr" :key="index">
                      <img :src="item">
                </yd-slider-item>
          </yd-slider>
          </div>
          <goTop 
         v-if="isOver"
         :scrollViews="scrollView"
         ></goTop>
     </div>
</template>
<script>
import Vue from "vue";
import { Slider, SliderItem } from "vue-ydui/dist/lib.px/slider";
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);
import commentItem from "../comment/item";
import couponItem from"../my/couponItem";
import goTop from　"../../common/goTop";
export default {
  components:{
    commentItem,//评论组件
    couponItem,//优惠券组件
    goTop
  },
  data() {
    return {
      scrollView:null,
      isOver:false,
      hasAddress:true,//是否有默认地址
      previewIndex: 1, //预览图上的索引
      initIndex: 1, //预览图初始化时的索引，不可与上面的索引公用，会有问题
      isShowPreview: false, //是否展示预览图模式
      gid: this.$route.query.id || "",
      showCouponPop: false, //优惠券领取弹窗
      isInPreviewModel:this.$route.query.preview?true:false,//是否处于预览模式下
      newUserComment:{},//最新一条评论数据
    };
  },
  computed:{
    renderData(){
      //从store拉取数据
      return this.$store.state.detail.detailData
    }
  },
  methods: {
    handleClickShowSpec(){
      this.$store.commit("setSpecPopStatus",true);
    },
    //展示大图预览
    handleShowPreview(inx) {
      this.initIndex = inx;
      this.previewIndex = inx;
      this.isShowPreview = true;
    },
    previewCallback(val) {
      this.previewIndex = val;
    },
    //跳转店铺首页
    handleJumpStore(m_id) {
      if(this.isInPreviewModel) return;
      this.$router.push({
        path: "/index/store_home",
        query: { mid:m_id }
      });
    },
    //立即领取优惠券
    getCoupon(item){
      if(this.isInPreviewModel) return;
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Coupon/get", {
          cn_id: item.cn_id
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          let mesg=res.data.message;
          if(res.data.code==0){
            this.$toast.success(mesg)
          }else{
            this.$toast.error(mesg)
          }
        });
    },
    //获取最新的一条用户评价
    getNewestComment(){
      this.$axios.post("/wap/Judge/getGoodsJudgeList",{
        type:0,
        g_id:this.gid
      }).then(res => {
        const _data = res.data;
        if(_data.code==0){
          const _obj=_data.data||{};
          _obj.g_id=this.gid;
            this.newUserComment=_obj;
        }
      });
    },
    handleJumpAllComment(){
      //非预览模式下跳转全部评论
      if(this.isInPreviewModel) return;
      this.$router.push("/index/comment_list?id="+this.gid)
      // this.$router.push("/index/comment_creat?osn=2018122551975110&oid=364")
      
    }
  },
  created() {
    //数据拉取,非预览模式下通过接口获取
    this.getNewestComment()
  },
  mounted(){
   this.scrollView=document.getElementById("detailView");
    if(this.scrollView) this.isOver=true;
  },
  beforeCreate() {
    //进入前清除下store的缓存,解决图片错乱问题
     this.$store.commit("setDetailData",{
        type:3,
        data:{}
      })
  },
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$border1px: 1px solid #f5f5f5;
$red: #dd2727;
$yellow: #ff9600;
.preview-box {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 1);
  .head {
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    p {
      position: absolute;
      right: 0;
      top: 0;
      right: 10px;
    }
  }
  .yd-slider {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
.detail-wrap {
 
  .swiper {
    height: pxToRem(750px);
    position: relative;
    .rightTips {
      position: absolute;
      right: 0;
      top: pxToRem(60px);
      color: #fff;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      background: rgba(0, 0, 0, 0.3);
      padding: pxToRem(14px) pxToRem(10px) pxToRem(14px) pxToRem(20px);
      z-index: 2;
    }
    .yd-slider {
      height: 100%;
      .yd-slider-wrapper {
        height: 100%;
        .yd-slider-item {
          height: 100%;
          height: pxToRem(750px);
          position: relative;
          img{
             @include imgCenter()
          }
        }
      }
      .yd-slider-pagination {
        .yd-slider-pagination-item {
          width: pxToRem(15px);
          height: pxToRem(15px);
          margin-right: pxToRem(18px);
          margin-bottom: pxToRem(34px);
          color: #aa9c89;
        }
        .yd-slider-pagination-item-active {
          background: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
  .info {
    border-top:1px solid #f5f5f5;
    background: #fff;
    padding-top: pxToRem(24px);
    margin-bottom: pxToRem(24px);
    .caption {
      padding: 0 pxToRem(24px) pxToRem(24px);
      h2 {
        color: $red;
        font-size: 23px;
        margin-bottom: pxToRem(10px);
        line-height: pxToRem(60px);
        span{
          margin-left:pxToRem(25px);
          font-size: 14px;
          color:#a9a9a9;
          b{
            text-decoration:line-through;
          }
        }
      }
      h4 {
        font-size: 15px;
        line-height: pxToRem(40px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

      }
      p {
        color: #959595;
        background: #f5f5f5;
        line-height: pxToRem(30px);
        position: relative;
        padding: pxToRem(12px) pxToRem(22px);
        border-radius: 2px;
        margin-top: pxToRem(20px);
      }
      p::after {
        content: "";
        width: pxToRem(15px);
        height: pxToRem(15px);
        position: absolute;
        left: pxToRem(30px);
        top: pxToRem(-8px);
        background: #f5f5f5;
        transform: rotate(45deg);
      }
    }
    .product-info {
      padding: 0 pxToRem(24px);
      background: #fbfbfb;
      .product-box {
        display: flex;
        justify-content: space-between;
        height: pxToRem(94px);
        // padding: pxToRem(20px) 0;
        border-bottom: 1px solid #f5f5f5;
        align-items: center;
        .right-ellipic{
          padding-right:pxToRem(40px);
        }
        .left {
          width: pxToRem(150px);
          padding-right: pxToRem(40px);
          flex-shrink: 0;
          display:flex;
          justify-items: center;
          span {
            display: inline-block;
            width: 100%;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 3px;
            white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          
          }
        }
        .center {
          font-size: 14px;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          span {
            color: #959595;
          }
          i {
            margin-right: pxToRem(20px);
          }
        }
        .right {
          width: pxToRem(114px);
          text-align: center;
          border: 1px solid $red;
          color: $red;
          border-radius: pxToRem(50px);
          align-self: center;
          height: pxToRem(50px);
          line-height: pxToRem(50px);
          margin-left: pxToRem(60px);
          flex-shrink: 0;
          white-space: nowrap;

        }
      }
      .discount {
        .left {
          span {
            color: #e2c331;
            border-color: #e2c331;
          }
        }
      }
      .offer {
        .left {
          span {
            color: #31b3ff;
            border-color: #31b3ff;
          }
        }
      }
      .product {
        .left {
          span {
            color: #959595;
            border-color: #959595;
          }
        }
        .center {
          position: relative;
          img {
            display: block;
            width: 8px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
        }
      }

      .give {
        .left {
          span {
            color: #959595;
            border-color: #959595;
          }
        }
      }
    }
  }
  .desc-wrap {
    background-color: #fff;
    padding: 0 pxToRem(26px) pxToRem(148px) pxToRem(26px);
    .titl {
      line-height: pxToRem(100px);
      font-size: 16px;
      color: #353535;
      text-align: center;
    }
    .content {
      @include richtext();
      img {
        width: 100%;
        display: block;
      }
    }
  }
   .pop-coupon-box{
    position: relative;
    .title-name{
      line-height: pxToRem(124px);
      height: pxToRem(124px); 
      position: fixed;
      top:0;
      width: 100%;
      font-size: 18px;
      background-color: #fff;
      left:0;
      right: 0;
      text-align: center;
      z-index: 999;
      i{
        position: absolute;
        right: 10px;
        top:50%;
        transform: translateY(-50%)
      }
    }
    .pop-default{
      img{
       width:50%;
       display:block;
       margin:70px auto 0 auto;
    }
    p{
       @include tips()
    }
  }
    .complete{
      background-color: #fff;
       position: fixed;
       bottom: 0;
       padding:pxToRem(40px) 0;
      left:0;
      right: 0;
      margin:0 auto;
      width: 100%;
      span{
        display: block;
      width: pxToRem(690px);
      margin:0 auto;
      text-align: center;
      line-height:pxToRem(88px);
      background-color: $red;
      border-radius: pxToRem(88px);
      font-size: 18px;
      color:#fff;
      }
    }
  }
  }
  .comment-wrap{
    h6{
      font-size:15px;
      font-weight:500;
      color:#1E1E1E;
      line-height:18px;
      background-color: #fff;
      padding:0 pxToRem(24px);
      padding-top:pxToRem(24px);
    }
    .jump-btn-wrap{
      background-color: #fff;
      padding-bottom: pxToRem(40px);
      margin-bottom:  pxToRem(24px);
    }
    .comment-item-wrap{
      margin-bottom: 0;
    }
    .jump-btn{
      width:pxToRem(230px);
      height:pxToRem(68px);
      border:1px solid #DDDDDD;
      border-radius:pxToRem(34px);
      line-height:pxToRem(68px); 
      text-align: center;
      color:#1E1E1E;
      font-size:14px;
      margin: 0 auto;
      
    }
    .empty-comment{
      line-height:40px;
      background-color: #fff;
      text-align: left;
      padding:0 pxToRem(24px);
      font-size: 14px;
      margin-bottom:  pxToRem(24px);
    }
}
</style>