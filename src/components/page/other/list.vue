<!-- 列表排序 默认从低到高，箭头上面亮，下面灰 -->
<template>

    <div class="goods-list-wrap">
         <my-search
          :isShow.sync="isShowSearch"
          :searchTips="searchTips"
          source="list"
          :preTitle="$route.meta.title"
          :handleClick="handleClickSearch"
         ></my-search>
        <div v-show="!isShowSearch">
        <section v-if="isEmpty" class="empty"><img src="../../../../static/img/other/searchnogoods_icon.png"><p>更多商品正在补充...</p></section>
        <section v-else>
        <ol class="filter" v-show="isLoadOver">
            <li v-for="(item,index) in filerArr"  :class="[item.active?'active':'',item.active&&item.arrow?('sort-'+item.sort):'']" @click="handleFilter(index)" :key="index"><span>{{item.name}}</span></li>
        </ol>
          <yd-infinitescroll :callback="getList" ref="infinitescroll">
                  <ul slot="list" class="result" v-if="!inRest">
                    <li v-for="(item,index) in list" :key="index"><good-item :list="item" :hasClick.sync="item.click"></good-item></li>
                  </ul>
                  <span slot="doneTip">{{$tips}}</span>
            </yd-infinitescroll>
        </section>
        </div>
        <goTop></goTop>
    </div>
</template>
<script>
import Vue from "vue";
import goodItem from "./item";
import mySearch from "../home/search";
import {InfiniteScroll} from 'vue-ydui/dist/lib.px/infinitescroll';
Vue.component(InfiniteScroll.name, InfiniteScroll);
import goTop from　"../../common/goTop";
export default {
   components: {
    mySearch,
    goodItem,
    goTop
  },
  data() {
    return {
      isLoadOver:false,//是否加载完毕
      inRest:false,//强制重新刷新
      isEmpty:false,
      searchTips:this.$route.query.p||"",
      keyword:this.$route.query.k||"",
      list: [],
      pageSize: 10,
      page: 1,
      goodStatus:0,
      isShowSearch:false,
      filerArr: [
        {
          name: "综合",
          arrow: 0,
          active: 1,
          sort: 0
        },
        {
          name: "销量",
          arrow: 1,
          active: 0,
          sort: 0,//排序：0 从高到低，1：从低到高
        },
        {
          name: "价格",
          arrow: 1,
          active: 0,
          sort: 0//排序：0 从高到低，1：从低到高
        }
      ]
    };
  },
  methods: {
    handleClickSearch(item){
      let timedata = new Date().getTime(); //解决在当前页面在进当前页面不加载问题
      this.$router.replace({path:"/index/list",query:{k:item,mid:this.$route.query.mid,cid:this.$route.query.cid,time:timedata,ps:this.$route.query.ps,pd:this.$route.query.pd,gid:this.$route.query.gid}})
    },
    handleFilter(inx) {
      this.filerArr.map((item, index) => {
        if (index == inx) {
          item.active = 1;
          //销量设置
          if(inx==1){
             item.sort==1? item.sort=2:item.sort=1;
          }else if(inx==2){
            //价格排序
            item.sort==3? item.sort=4:item.sort=3;
          }
        } else {
          item.active = 0;
          item.sort = 0;
        }
      });
    // 1销量倒序，2销量正序，3价格倒序，4价格正序
    this.goodStatus=this.filerArr[inx].sort;
     this.getList(true)
    },
    getList(flag) {
      if(flag) this.page=1; //flag 为true表示点击了其他排序选项，故page重置，数据清空
      if(this.page==1){
        this.$store.commit("setLoading", true)
      }
      //提交数据
      const obj={
          keyword:this.keyword||"",
          pagesize: this.pageSize,
          page: this.page,
          goods_orderby_status:this.goodStatus
      }
      if(this.$route.query.cid) obj.c_id=this.$route.query.cid;
      if(this.$route.query.gid) obj.gc_id=this.$route.query.gid;
      if(this.$route.query.mid) obj.m_id=this.$route.query.mid;
      if(this.$route.query.ps) obj.price_start=this.$route.query.ps;
      if(this.$route.query.pd) obj.price_end=this.$route.query.pd;
      //数据end
      this.$axios.post("/wap/Goods/getList",obj)
        .then(res => {
          const _data = res.data;
          if(this.page==1) {
            this.isLoadOver=true;
            this.$store.commit("setLoading", false)
          };
          if(flag){
            this.inRest = true;
                this.$nextTick(t => {
                    this.inRest = false;
                })
          }
          if (_data.code == 0) {
                  
                const _list=_data.data.data?_data.data.data:[];
                if(this.page==1 && _list.length==0) this.isEmpty=true;
                _list.map((item)=>{
                  item.click=false
                })
                this.list = flag? _list:this.list.concat(_list);
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
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$red: #dd2727;
$grey: #959595;
.goods-list-wrap {
  .empty{
    width: 50%;
    @include fixedCenter();
    p{
      @include tips();
    }
  }
  .filter {
    display: flex;
    padding: 0 pxToRem(30px);
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #353535;
    height: pxToRem(90px);
    border-bottom: 1px solid #f5f5f5;
    li {
      width: pxToRem(140px);
      padding: pxToRem(22px) 0;
      color: #353535;
      &.active span{
          color: $red;
      }
      span {
        padding-right: 12px;
        position: relative;
        display: inline-block;
        height: 20px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          right: 0;
          border-width: 4px;
          border-style: solid;
          border-left-color: transparent;
          border-right-color: transparent;
        }
        &:before {
          top: 1px;
           border-top-color: transparent;
        }
        &:after {
          bottom: 1px;
          border-bottom-color: transparent;
        }
      }
      &.active.sort-1 span,&.active.sort-3 span{
        &:before {
          border-bottom-color: $grey;
        }
        &:after {
          border-top-color: $red;
        }
      }
      &.active.sort-2 span,&.active.sort-4 span {
        &:before {
          border-bottom-color: $red;
        }
        &:after {
          border-top-color: $grey;
        }
      }
    }
    li:nth-of-type(1) {
      text-align: left;
      span{
       &:before, &:after{
         display: none
       }
      }
    }
    li:nth-of-type(3) {
      text-align: right;
    }
    li:nth-of-type(2) {
      text-align: center;
    }
  }
}
</style>


