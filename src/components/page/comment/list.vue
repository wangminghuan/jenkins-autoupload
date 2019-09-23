<template>
 <!-- 用户评价 -->
 <section class="common-scroll-wrap">
  <div class="comment-all-list-wrap common-scroll-wrap" :style="comStyle"  id="commentView">
    <h6 class="title"><span>商品评价（{{total}}）</span><em>好评度<i>{{(parseFloat(rate)*100)+"%"}}</i></em></h6>
    <yd-infinitescroll :callback="getList" ref="infinitescroll">
          <section slot="list" class="list-wrap">
              <comment-item :itemData="item" v-for="(item,index) in list" :key="index" :type="1"></comment-item>
          </section>
          <span slot="doneTip" class="tips">—— 没有更多了 ——</span>
  </yd-infinitescroll>
  </div>
  <goTop 
     v-if="isOver"
    :scrollViews="scrollView"
    ></goTop>
  </section>
</template>
<script>
import Vue from "vue";
import commentItem from "./item";
import {InfiniteScroll} from 'vue-ydui/dist/lib.px/infinitescroll';
Vue.component(InfiniteScroll.name, InfiniteScroll);
import goTop from　"../../common/goTop";
export default {
  components:{
    commentItem,
    goTop
  },
  data(){
    return{
        scrollView:null,
        isOver:false,
        list:[],
        total:0,
        rate:1,
        pageSize:10,
        page:1,
        g_id:this.$route.query.id||"",
        comStyle:{}
    }
  },
  methods:{
    getList() {
        this.$axios.post("/wap/Judge/getGoodsJudgeList",{
          type:1,
          g_id:this.g_id,
          pagesize: this.pageSize,
          page: this.page,
        }).then(res => {
            const _data = res.data;
            if(this.page==1) this.$store.commit("setLoading", false);
            if (_data.code == 0) {
                const obj=_data.data||{};
                const _list=obj.data?obj.data:[];
                this.list =this.list.concat(_list);
                if(this.page==1){
                  this.total=obj.total;
                  this.rate=obj.goods_rate;
                }
                 if (_list.length < this.pageSize ) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescroll.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                this.page++;
            }else{
              this.$toast.error(_data.message)
            }
            
            /* 单次请求数据完毕 */
            this.$refs.infinitescroll.$emit('ydui.infinitescroll.finishLoad');   
            });
    },
  },
  created(){
      this.getList();
  },
  mounted(){
    this.comStyle={
      height:window.innerHeight-document.querySelector(".btm-tools").clientHeight+'px'
    }
    this.scrollView=document.getElementById("commentView");
    if(this.scrollView) this.isOver=true;
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.comment-all-list-wrap{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow-x: hidden;
    overflow-y: auto;
    transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1), -webkit-transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
    -webkit-overflow-scrolling: touch;
    .tips{
      color:#CCCCCC;
      b{
        position: relative;
        &:after{
          content: "";
           width: 20px;
           height: 1px;
           background-color: #CCCCCC;
           position: absolute;
           top:50%;
           transform: translateY(-50%);
           left:-25px;
        }
        &:before{
          content: "";
           width: 20px;
           height: 1px;
           background-color: #CCCCCC;
           position: absolute;
           top:50%;
           transform: translateY(-50%);
           right:-25px;
        }
      }
    }
    .yd-list-donetip{
      margin-bottom: pxToRem(40px) ;
    }
    .title{
      background-color: #fff;
      padding:0 pxToRem(24px);
      height:pxToRem(88px) ;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #F5F5F5;
      align-items: center;
      span,em{
      font-size:15px;
      font-weight:500;
      color:#1E1E1E;
      line-height:18px;
      }
      i{
        color: #DD2727;
        margin-left: pxToRem(10px);
      }
    }
    
}
</style>

