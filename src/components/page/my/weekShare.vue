<template>
  <section class="week-share-outer-wrap">
    <div v-if="isLoadOver && dataList.length==0" class="empty">
    <img src="../../../../static/img/my/week-sahre-def.png">
    <p>暂无分享商品</p>
  </div>
  <div class="my-week-wrap" v-else>
    <!-- <yd-infinitescroll :callback="getList" ref="infinitescroll"> -->
    <yd-slider slot="list" :loop="false" v-for="(item,index) in dataList" :key="index">
        <yd-slider-item v-for="(sitem,sindex) in item.goods_detail" :key="sindex">
             <week-share-item :item="sitem"></week-share-item>
        </yd-slider-item> 
    </yd-slider>
    <!-- </yd-infinitescroll> -->
    <!-- <go-top></go-top> -->
  </div>
  </section>
</template>
<script>
import Vue from "vue";
import { Slider, SliderItem } from "vue-ydui/dist/lib.px/slider";
// import {InfiniteScroll} from 'vue-ydui/dist/lib.px/infinitescroll';
import weekShareItem from "src/components/page/my/weekShareItem";
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);
// Vue.component(InfiniteScroll.name, InfiniteScroll);
// import goTop from　"../../common/goTop";
export default {
 components:{
    "week-share-item":weekShareItem,
    // "go-top":goTop
  },
  data(){
    return{
    isLoadOver:false,
     dataList:[],
     pagesize:10,
     page:1,
    }
  },
  methods:{
    getList() {
        // if(this.page==1){
        //   this.$store.commit('setLoading', false)  
        // }
        this.$axios.post("/wap/WeekShare/getWeekList", {
            pagesize: this.pageSize,
            page: this.page,
            })
            .then(res => {
            const _data = res.data;
            if (_data.code == 0) {
                const _list=_data.data?_data.data:[];
                _list.map((item)=>{
                  item.goods_detail.map((sitem)=>{
                        sitem.current_datetime=item.current_datetime;
                        sitem.wsl_end_time=item.wsl_end_time;
                        sitem.wsl_start_time=item.wsl_start_time;
                        sitem.week=item.week;
                        sitem.is_today=item.is_today;
                  })
                   item.click=false
                })
                this.dataList =_list;
                this.isLoadOver = true;
                //  if (_list.length < this.pageSize ) {
                //         /* 所有数据加载完毕 */
                //      this.$refs.infinitescroll.$emit('ydui.infinitescroll.loadedDone');
                //      return;
                //     }
                // this.page++;
            }
            this.$store.commit('setLoading', false) 
            /* 单次请求数据完毕 */
            // this.$refs.infinitescroll.$emit('ydui.infinitescroll.finishLoad');   
            });
    }
  },
  created(){
    this.getList(); 
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.week-share-outer-wrap{
 position: absolute;
    z-index: 999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
    -webkit-overflow-scrolling: touch;
}
 .empty{
    width: 50%;
    text-align: center;
    @include fixedCenter();
    p{
      @include tips();
    }
   }
.my-week-wrap{
   padding:0 pxToRem(20px);
   padding-bottom: pxToRem(20px);
   .yd-slider{
     padding-top:pxToRem(20px);
   }
   .yd-slider-item{
    //  border-left: pxToRem(20px) solid #f5f5f5;
    //  border-right: pxToRem(20px) solid #f5f5f5;
   }
   .yd-slider-pagination{
     justify-content: flex-end;
     padding-right:pxToRem(20px); 
   }
  
}
</style>

