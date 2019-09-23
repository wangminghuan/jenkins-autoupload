<!-- 首页 -->
<template>
     <div class="home-wrap common-scroll-view" id="homeView">
         <section class="swiper">
             <yd-slider autoplay="4000" :loop="true">
                <yd-slider-item  v-for="(item,index) in bannerList" :key="index">
                    <a :href="item.am_url" @click="maiBannerSwiper(index,'banner')">
                         <img class="swipe-img" :src="item.am_image">
                    </a>
                </yd-slider-item> 
                
            </yd-slider>
         </section>
         <section class="category">
             <ul class="row-wrap" v-if="cateArr.length>0">
                 <li v-for="(items,indexs) in cateArr" :key="indexs" @click="handleJumpList(items,indexs)"><i><img v-lazy="items.icon"></i><em>{{items.name}}</em></li>
             </ul>
         </section>
         <section class="week-share" v-if="weekShare.length>0">
             <yd-slider  :loop="false">
                <yd-slider-item  v-for="(item,index) in weekShare" :key="index">
                    <week-share-item :item="item"></week-share-item>
                </yd-slider-item> 
                
            </yd-slider>
         </section>
         <section class="activity">
             <ul class="top">
                 <ol v-for="(item,index) in funCategoryList" :key="index"><li v-if="index<4"><div @click="handleJumpActTop(item,index)"><img v-lazy="item.fcm_image"></div></li></ol>
             </ul>
             <!-- hjp暂时去掉图文广告 -->
             <!-- <ul class="btm">
                 <li v-for="(item,index) in imageTextList" :key="index" v-if="index<4"><div @click="handleJumpActBtm(item)"><img v-lazy="item.am_image"></div></li>
             </ul> -->
         </section>
         <section :class="['home_icon',isShow?'icon-show':'icon-hide']" @click.stop="jumpRulesPage"></section>
         <section class="recommend">
             <div class="title">
             <h5>人气推荐</h5>
             <h6>Popularity Recommendation</h6>
             </div>
            <yd-infinitescroll :callback="getList" ref="infinitescroll">
                        <ul slot="list" class="list-wrap">
                            <li v-for="(item,index) in recommendList" :key="index" @click="jumpDetail(item)" :class="item.click?'is-click':''">
                                <div class="cover"><img v-lazy="item.g_images"></div>
                                <p class="caption">{{item.g_name}}</p>
                                <p class="price"><i>￥</i><em>{{item.g_price}}</em></p>
                            </li>
                        </ul>
                        <span slot="doneTip"></span>
                </yd-infinitescroll>
         </section>
     </div>
</template>
<script>
import {
  scrollTop,
  setScrollTop,
  getScrollTop,
  getScrollview
} from "../../../utils/utils"
import Vue from "vue";
import { Slider, SliderItem } from "vue-ydui/dist/lib.px/slider";
import {InfiniteScroll} from 'vue-ydui/dist/lib.px/infinitescroll';
import weekShareItem from "src/components/page/my/weekShareItem";
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);
Vue.component(InfiniteScroll.name, InfiniteScroll);
export default {
  components:{
    "week-share-item":weekShareItem
  },
  data() {
    return {
      weekShare:[],
      bannerList:[],
      cateArr: [],
      funCategoryList:[],
      imageTextList:[],
      recommendList:[],
      bannerImgList:[],
      isShow: false,
      pageSize:10,
      page:1,
    };
  },
  created(){
     this.getWeekShare();
      this.getRenderData();
      this.getList();
  },
  methods: {
      jumpRulesPage () {
          this.$router.push({path:'./homeRule',query: { id: 0 }})
      },
      //处理卖点业务
      handleMaiDiaOne(type){
          switch(type){
              case 'banner': MtaH5.clickStat("home_bannerone"); 
              case 'category': MtaH5.clickStat("home_gnone");
              case 'activity': MtaH5.clickStat("home_twggone");
          }
      },
      handleMaiDiaTow(type){
          switch(type){
              case 'banner': MtaH5.clickStat("home_bannertwo"); 
              case 'category': MtaH5.clickStat("home_gntwo");
              case 'activity': MtaH5.clickStat("home_twggtwo");
          }
      },
      handleMaiDiaThree(type){
          switch(type){
              case 'banner': MtaH5.clickStat("home_bannerthree"); 
              case 'category': MtaH5.clickStat("home_gnthree");
              case 'activity': MtaH5.clickStat("home_twggthree");
          }
      },
      handleMaiDiaFour(type){
          switch(type){
              case 'banner': MtaH5.clickStat("home_bannerfour"); 
              case 'category': MtaH5.clickStat("home_gnfour");
              case 'activity': MtaH5.clickStat("home_twggfour");
          }
      },
      //hjp 加埋点  type: banner首页轮播模块四个 category首页功能模块四个 activity首页图文广告模块四个
      maiBannerSwiper(index,type){
          if(typeof MtaH5 !=="undefined"){
            switch(index){
                case 0: this.handleMaiDiaOne(type)
                case 1: this.handleMaiDiaTow(type)
                case 2: this.handleMaiDiaThree(type)
                case 3: this.handleMaiDiaFour(type)
            }
          }
      },
      removeLazyImg(node){
        if(!node) return;
        node.setAttribute("src",node.getAttribute("data-src"))
      },
      //活动跳转，fcm_type为1 跳转url, fcm_type为2跳转列表
      handleJumpActTop(item,index){
         this.maiBannerSwiper(index,'activity')
         if(item.fcm_type==2){
             let obj={
                  cid:item.c_id
             }
             if(item.g_price1) obj.ps=item.g_price1;
             if(item.g_price2) obj.pd=item.g_price2;
             this.$router.push({path:"/index/list",query:obj})
         }else if(item.fcm_url){
             window.location.href=item.fcm_url
         }
      },
      handleJumpActBtm(item){
         if(item.am_url){
             window.location.href=item.am_url
         }
      },
      jumpDetail(item){
          item.click=true;
          this.$router.push({path:"/index/detail",query:{id:item.g_id}}) 
      },
      getRenderData(){
          this.$axios.post("/wap/Index/indexMultiple")
          .then((res)=>{
            const _data=res.data;
            if(_data.code==0){
             this.isShow = true;
             const _obj=_data.data||{};
             this.bannerList=_obj.banner||[];
             this.bannerList.map((e)=>{
                 this.bannerImgList.push(e.am_image)
             })
             this.cateArr=_obj.categoryMain||[];
             this.funCategoryList=_obj.funCategory||[];
             this.imageTextList=_obj.imageText||[];
            }
            this.$store.commit('setLoading', false)
          })
      },
      getWeekShare(){
        this.$axios.post("/wap/WeekShare/getHomepageList")
          .then((res)=>{
            const _data=res.data;
            if(_data.code==0){
             this.weekShare=_data.data||[];
            }
            // this.$store.commit('setLoading', false)
          })
      },
      handleJumpList(item,index){
        this.maiBannerSwiper(index,'category');
       this.$router.push({ path: "/index/list",query:{
           p:item.name,
           cid:item.c_id
       }});
      },
      getList() {
        this.$axios.post("/wap/Goods/getList", {
            pagesize: this.pageSize,
            page: this.page,
            goods_orderby_status:"0"
            })
            .then(res => {
            const _data = res.data;
            if (_data.code == 0) {
                const _list=_data.data.data?_data.data.data:[];
                _list.map((item)=>{
                   item.click=false
                })
                this.recommendList =this.recommendList.concat(_list);
                 if (_list.length < this.pageSize ) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescroll.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                this.page++;
            }
            /* 单次请求数据完毕 */
            this.$refs.infinitescroll.$emit('ydui.infinitescroll.finishLoad');   
            });
    },
    handleIocnScroll () {
        let offsetTop = window.pageYOffset;
        let offsetHeight = window.innerHeight;
        let dom = document.getElementById('homeView')
        if(dom) {
            offsetTop = dom.scrollTop;
            offsetTop === 0 ? this.isShow = true : this.isShow = false
        }
    }
  },
  mounted() {
      let dom = document.getElementById('homeView')
      dom.addEventListener('scroll', this.handleIocnScroll, false)
      if(typeof MtaH5 !=="undefined"){
            MtaH5.clickStat("home_views")
        };
    },
    beforeDestroy() {
        let dom = document.getElementById('homeView')
        dom.removeEventListener('scroll', this.handleIocnScroll, false);
    }
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$lazyBackColor:#f5f5f5;
.home-wrap {
    padding-bottom:pxToRem(200px) ; 
    top:pxToRem(100px);
    .home_icon{
        width: pxToRem(101px);
        height: pxToRem(111px);
        background: url('../../../../static/img/bus-entry.png') no-repeat;
        background-size: 100% 100%;
        position: fixed;
        bottom: pxToRem(300px);
        // transform: translate3d(0,0,0);
        right: 5px;
        transition: all 0.3s;
        z-index: 99;
    }
    .icon-show{
      transform: translate3d(0,0,0);
      opacity: 1.0;
    }
    .icon-hide{
      transform: translate3d(100%,0,0);
      opacity: 0;
    }
   .yd-slider-item{
       height:pxToRem(340px) ;
       overflow: hidden;
       background-color: $lazyBackColor;
       position: relative;
   }
  .category {
    padding-bottom:pxToRem(30px);
    background-color: #fff;
    .row-wrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li {
        margin-top:pxToRem(20px) ;
        width: 20%;
        font-size: 12px;
        height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        // overflow: hidden;
        // text-overflow: ellipsis;
        //  white-space: nowrap;
        i {
          width: pxToRem(82px);
          height: pxToRem(82px);
          border-radius: 50%;
          background-color: $lazyBackColor;
          margin-bottom: pxToRem(18px);
          overflow: hidden;
          position: relative;
          img{
           border-radius: 50%;
          }
        }
        em{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 90%;
        }
      }
    }
  }
  .activity {
    ul.btm {
      display: flex;
      justify-content: space-between;
      padding: pxToRem(10px);
      padding-top:0;
      li {
        width: pxToRem(350px);
        height: pxToRem(262px);
         margin-right:pxToRem(10px);
        background-color: $lazyBackColor;
        overflow: hidden;
        position: relative;
      }
      li:last-child{
          margin-right: 0
      }
    }
    ul.top {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        
      li {
          width: pxToRem(370px);
        height: pxToRem(187px);
        background-color: #937efd;
        margin-bottom:pxToRem(10px); 
        overflow: hidden;
        position: relative;
        background-color: $lazyBackColor;
      }
    }
  }
  .recommend{
      background-color: #fff;
      .title{
          border-bottom: 1px solid #f5f5f5;
          position: relative;
          
          &:after{
              content: "";
              position: absolute;
              width:pxToRem(60px);
              height: 2px;
              background-color:#2fb3ff;
              bottom:0;
              left:0;
              right: 0;
              margin:0 auto;
          }
          h5{
             margin-top:pxToRem(8px); 
             line-height: pxToRem(65px); 
             text-align: center;
             font-size:16px; 
             color: #353535
          }
          h6{
             line-height: pxToRem(32px); 
             text-align: center;
             font-size:14px; 
             margin-bottom:pxToRem(26px); 
             color: #959595; 
          }
      }
      .list-wrap{
          display: flex;
           flex-wrap: wrap;
           padding:0 pxToRem(30px); 
           padding-bottom: pxToRem(30px); 
           justify-content: space-between;
        //    height: 2000px;
          li{
              width:pxToRem(330px);
              box-sizing: border-box;
              border:1px solid #f5f5f5;
              margin-top:pxToRem(46px);
              padding-bottom: pxToRem(10px);
          }
          .cover{
              width: 100%;
              height: pxToRem(326px);
              overflow: hidden;
              position: relative;
               background-color: $lazyBackColor;
            //   background-color: #353535;
          }
          .caption{
              line-height: 20px;
              padding:0 pxToRem(18px);
              color: #353535;
              height:40px;
              overflow: hidden;
              margin-top:pxToRem(14px);
            //   margin-bottom:pxToRem(14px) 
          }
          .price{
              color:#dd2727; 
             padding:0 pxToRem(18px);
             i{
                 font-size:10px; 
             }
             em{
                 font-size:16px; 
                line-height:24px; 
             }
            
          }
      }
      .is-click .caption{
         color: #d8d8d8
      }
  }
  .yd-slider-item .swipe-img, .activity li img,.category li img, .list-wrap li img{
        @include imgCenter()
  }
  .week-share{
    padding:0 pxToRem(24px);
    margin-top:14px;
    // padding-bottom: 0;
    .yd-slider-pagination{
      justify-content: flex-end;
      bottom: 20px;
      padding-right:pxToRem(24px);
    }
  }
}
</style>