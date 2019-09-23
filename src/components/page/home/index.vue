<!-- 首页 搜索+首页数据-->
<template>
     <div :class="['common-scroll-wrap','home-outer-wrap',!isShowSearch?'home-search-fixed':'']">
         <my-search 
         searchTips="请输入搜索内容"
         :isShow.sync="isShowSearch"
         source="home"
         :preTitle="$route.meta.title"
         :handleClick="handleJump"
         ></my-search>
         <my-home v-show="!isShowSearch" id="homeView"></my-home>
         <goTop 
         v-if="isOver"
         :scrollViews="scrollView"
         ></goTop>
     </div>
</template>
<script>
import myHome from "./home";
import mySearch from "./search";
import goTop from　"../../common/goTop";
export default {
    components:{
        myHome,
        mySearch,
        goTop
    },
  data() {
    return {
        isOver:false,
        showBackTop:false,
        isShowSearch:false,
        scrollView:null,
        timer:null,
    };
  },
  methods:{
      handleJump(item){
          this.$router.push({path:"/index/list",query:{k:item}})
      }
  },
  mounted(){
      this.scrollView=document.getElementById("homeView");
      if(this.scrollView) this.isOver=true;
  }
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.home-outer-wrap{
     position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
.home-search-fixed{
    padding-top:pxToRem(100px);
    position: relative;
    .common-search-input {
      position: fixed;
      top:0;
      left:0;
      right:0;
      z-index: 99999;
      border-bottom: 1px solid #f5f5f5
    }
}
</style>