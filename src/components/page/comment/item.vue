<template>
<!-- 每条用户评价 -->
  <div class="comment-item-wrap" @click="handleJumpDetail">
      <section class="top">
        <div class="lf">
          <div class="avator">
              <userAvatar :uid="itemData.u_id" :url="itemData.ogj_is_anonymous==1?'':itemData.u_avatar"></userAvatar>
          </div>
          <div class="uname">{{itemData.u_username}}</div>
        </div>
         <myRate v-if="type==1||type==2" v-model="itemData.ogj_star" :width="12+''" :height="12+''" :disabled="true"></myRate>
      </section>
      <section class="mid content-1" v-if="type==1||type==3">
         <p>{{itemData.ogj_filter_context || "好评！"}}</p>
         <ul class="img-wrap" v-if="imgArr.length>0">
           <li :class="index%4==3?'noMargin':''" v-for="(item,index) in imgArr" :key="index"><img v-lazy="cropperImg(item)"></li>
         </ul>
      </section>
      <section class="mid content-2" v-else-if="type==2">
         <p>{{itemData.ogj_filter_context}}</p>
         <ul class="img-wrap" v-if="imgArr.length>0">
           <li  v-for="(item,index) in imgArr" :key="index"><img v-lazy="cropperImg(item)" @click.stop="handleShowPreview(index)"></li>
         </ul>
      </section>
      <section class="btm">
          <span v-if="type==1||type==2">{{itemData.create_time}}</span>
          <em>{{specArr.join("；")}}</em>
      </section>
      <section class="link" v-if="this.type==2" @click="handleJumpGoodsDetail">
          <div class="lf"><img v-lazy="cropperImg(goodsImage)"></div>
          <div class="rt">{{itemData.g_name}}</div>
      </section>
      <div class="preview-box" v-if="isShowPreview">
        <div class="head"><span>{{(previewIndex+1)+"/"+imgArr.length}}</span><p class="close" @click.stop="isShowPreview=false">关闭</p></div>
        <yd-slider :index="initIndex" :callback="previewCallback" :show-pagination="false">
                <yd-slider-item v-for="(item,index) in imgArr" :key="index">
                      <img :src="item">
                </yd-slider-item>
          </yd-slider>
        </div>
  </div>
</template>
<script>
import Vue from "vue";
import myRate from "./rate"
import { Slider, SliderItem } from "vue-ydui/dist/lib.px/slider";
import { setInterval } from 'timers';
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);
import userAvatar from "../my/userAvatar";
export default {
  components:{
    myRate,
    userAvatar
  },
  props:{
    type:{
      type:Number, //1， 列表，2 详情 3 商品详情入口
       value:1,
    },
    itemData:{
      type:Object,
       value:{}
    }
  },
  data(){
    return{
      previewIndex: 1, //预览图上的索引
      initIndex: 1, //预览图初始化时的索引，不可与上面的索引公用，会有问题
      isShowPreview: false, //是否展示预览图模式
  
    }
  },
  computed:{
    imgArr(){
          // imgArr: [],//预览图片库
      return typeof (this.itemData.ogj_image) =='string' && this.itemData.ogj_image!=''?this.itemData.ogj_image.split('|'):[];
    },
    goodsImage(){
      return typeof (this.itemData.g_image) =='string'&& this.itemData.g_image!=''?this.itemData.g_image.split(',')[0]:"";
    },
    specArr(){
      
      let arr=this.itemData.sku_spec && JSON.parse(this.itemData.sku_spec) instanceof Array?JSON.parse(this.itemData.sku_spec):[];
      
      // let result=arr.map((item)=>{
      //   return item.spec+"："+item.spec_value
      // })
      // console.log(result)
      return arr.map((item)=>{
        return item.spec+"："+item.spec_value
      })
    }
  },
  methods:{
    cropperImg(url){
      return url+'?x-oss-process=image/resize,m_fill,h_400,w_400'
    },
    handleJumpGoodsDetail(){
      this.$router.push("/index/detail?id="+this.itemData.g_id)
    },
    handleJumpDetail(){

      if(this.type==1){
        this.$router.push("/index/comment_detail?id="+this.itemData.ogj_id)
      }else if(this.type==3){
         this.$router.push("/index/comment_list?id="+this.itemData.g_id)
      }
      
    },
    //展示大图预览
    handleShowPreview(inx) {
      this.initIndex = inx;
      this.previewIndex = inx;
      this.isShowPreview = true;
    },
    //预览回调
    previewCallback(val) {
      this.previewIndex = val;
    },
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.comment-item-wrap{
  padding: 0 pxToRem(24px); 
  background-color: #fff;
  margin-bottom: pxToRem(16px); 
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
    height: 80%;
    overflow: scroll;
    will-change: transform;
    -webkit-overflow-scrolling: touch;
  }
}
  .rate-wrap{
    height: pxToRem(50px); 
  }
  .top{
     padding-top:pxToRem(32px); 
     padding-bottom:pxToRem(20px); 
     display: flex;
     justify-content: space-between;
     align-items: center;
     .lf{
       display: flex;
       align-items: center;
       flex-shrink: 0;
       height: pxToRem(50px); 
     }
     .avator{
       height: pxToRem(50px); 
       width:pxToRem(50px); 
       margin-right:pxToRem(17px);
     }
     .uname{
       font-size:12px;
        width:pxToRem(200px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color:rgba(30,30,30,1);
     }
  }
  .mid{
    font-size:14px;
    color:rgba(102,102,102,1);
    line-height:22px;
    li{
       position: relative; 
        background-color: #f5f5f5;
        overflow: hidden;
      img{
          @include imgCenter();
      }
    }
  }
  .content-1{
    p{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .img-wrap{
      display: flex;
      flex-wrap: wrap;
      margin-top:pxToRem(20px); 
      li{
        height: pxToRem(164px); 
        width:pxToRem(164px); 
        margin-right:pxToRem(14px);  
        margin-bottom:pxToRem(11px);  
          img[lazy=loaded]{
           height: pxToRem(164px); 
           width:pxToRem(164px); 
          }
      }
      li.noMargin{
        margin-right:0;  
      }
    }
  }
  .content-2{
    .img-wrap{
      display: flex;
      flex-direction: column;
      margin-top:pxToRem(20px); 
      li{
        height: pxToRem(526px); 
        width:pxToRem(702px); 
       margin-bottom:pxToRem(20px); 
      //  background-color: #fff;
      }
      img[lazy=loaded]{
        min-height: pxToRem(526px); 
        width:pxToRem(702px); 
      }
    }
     
  }
  .btm{
    font-size:12px;
    color:rgba(149,149,149,1);
    line-height:16px;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom:pxToRem(32px); 
    padding-top:pxToRem(20px); 
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
    span{
      margin-right: pxToRem(30px);
      flex-shrink: 0;
      white-space: nowrap;
    }
    em{
      flex-shrink: 0;
      white-space: nowrap;
      width: pxToRem(400px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    b{
      margin-right: pxToRem(20px);
    }
  }
  .link{
    height:pxToRem(178px);
    display: flex;
    align-items: center;
    border-top:1px solid #f5f5f5;
    .lf{
      width:pxToRem(116px);
      height:pxToRem(116px);
      position: relative; 
      background-color: #f5f5f5;
      overflow: hidden;
      border:1px solid #f5f5f5;
      margin-right:pxToRem(22px); 
      img{
          @include imgCenter();
      }
      img[lazy=loaded]{
        width:pxToRem(116px);
        height:pxToRem(116px);
      }
      // img[lazy=loaded]{
      //   width:pxToRem(116px);
      //   height:pxToRem(116px);
      // }
    }
    .rt{
      font-weight:500;
      color:#202020;
      font-size: 14px;
      line-height: pxToRem(36px);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>


