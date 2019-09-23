<template>
   <div>
   <form action="/" method="get" autocomplete="off" onsubmit="return false">
    <section :class="['common-search-input',isShowSearch?'has-back-icon':'']" @click="handleShowSearch">
             <p :class="['search-input',isShowSearch?'':'search-list']"><input type="text" ref="userInput" v-model="search" :placeholder="searchTips" @keyup.enter="handleSearch"><i class="clear-icon" v-show="search.length>0" @click.stop.prevent="handleClearInput"></i><b class="search-icon" @click="handleSearch"></b></p>
             <span v-if="isShowSearch" style="color:#959595" @click.stop.prevent="isShowSearch=false">取消</span> 
             <!-- <span v-else-if="source!='list'"  @click="handleSearch">搜索</span>  -->
  </section>
  </form>
    <div v-show="isShow && list.length>0" class="search-hot-words common-scroll-view">
         <div class="top">历史搜索记录</div>
         <ul class="list">
             <li @click="handleClickHot(item)" v-for="item in list" :key="item">{{item}}</li>
         </ul>
     </div>
     </div>
</template>
<script>
import {getClientHeight} from "../../../utils/utils.js"
export default {
    props:{
        searchTips:{
            type:String,
            default:"请输入搜索内容"
        },
        value:String,
        isShow:{
            type:Boolean,
            default:false
        },
        source:{
            type:String,
            default:""
        },
        preTitle:{
            type:String,
            default:""
        },
        handleClick:{
            type:Function,
            default:()=>{}
        }
    },
    data(){
        return{
            hasInputChange:false,//监听输入是否变化
            search:this.$route.query.k||"",
            wrapHeight:getClientHeight(),
            list:[],
            isShowSearch:this.isShow,
        }
    },
    watch:{
        //双向绑定
        value(val){
            this.search = val;
        },
        search(val){
            this.$emit('input', val);
        },
        isShow(val){
            this.isShowSearch=val;
            const footerMenu=document.getElementById("nav-bar-wrap");
            if(val){
              this.getKeyword();
              footerMenu && (footerMenu.style.display="none")
            }else{
               footerMenu && (footerMenu.style="")
            }
            
        },
        isShowSearch(val){
          this.$emit('update:isShow', val)
          val?this.$setTitle("搜索"):this.$setTitle(this.preTitle);
        }
    },
    methods:{
       //清除用户输入
      handleClearInput(){
        this.search="";
        this.$refs.userInput.focus()
      },
      //hjp 搜索添加埋点
      searchMta(){
          if(typeof MtaH5 !=="undefined"){
              MtaH5.clickStat("home_ss")
          }
      },
      handleShowSearch(){
          this.searchMta();
          //本身已经在搜索页面了，就阻止执行
          if(this.isShowSearch) return;
           this.isShowSearch=true;
      },
      handleSearch(e){
          //不在搜索页面点击按钮不跳转
          if(!this.isShowSearch) return;
          if(this.search.replace(/\s+/,'')=="") {
              this.$toast.error("请输入搜索内容")
              return;
          }
          //如果输入内容没有变化就返回，关闭搜索模式
          if(this.search===this.$route.query.k){
                e.stopPropagation();
                this.isShowSearch=false;
                return
          }
          this.handleClickHot(this.search)
      },
      handleClickHot(item){
          this.handleClick(item)
      },
      getKeyword(){
          this.$axios.post("/wap/UserSearchKeyword/getList")
          .then((res)=>{
            const _data=res.data;
            if(_data.code==0){
                 this.list=_data.data
            }
          })
      }
    },
    activated() {
        //解决某些状态下title展示异常的问题
        (this.isShow)?this.$setTitle("搜索"):this.$setTitle(this.preTitle);
    },
    created(){
        // this.getKeyword()
    },
    mounted() {
        if(document.getElementById("nav-bar-wrap")) this.wrapHeight=this.wrapHeight-document.getElementById("nav-bar-wrap").clientHeight-10;
        // window.addEventListener("resize",()=>{
        //     this.$toast("resize触发！")
        // })
    },
    
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.common-search-input {
  padding: 0 pxToRem(30px);
  height: pxToRem(100px);
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  align-items: center;
  .back{
      display: none;
  }
  
  .search-input {
    height: pxToRem(64px);
    width: pxToRem(604px);
    background-color: #f2f2f2;
    color: #959595;
    border-radius: pxToRem(64px);
    padding-left: pxToRem(60px);
    background-image: url("../../../../static/img/search.png");
    @include backgroundImage(12px, center, 12px, auto);
    position: relative;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    input{
        height: 18px;
        line-height: 18px;
        width: pxToRem(400px);
    }
  }
  .search-input.search-list{
      width: 100%;
  }
  span {
    color: #5bb0f9;
    line-height: pxToRem(64px);
    padding: 0 pxToRem(10px);
    // width: 
    flex-shrink: 1;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .clear-icon{
    width: 28px;
    height: pxToRem(64px);
    position: absolute;
    right: 4px;
    @include backgroundImage(center,center,14px,auto);
    background-image: url("../../../../static/img/s-close.png")
  }
  .search-icon{
    display:none ;
    width: 28px;
    height: pxToRem(64px);
    position: absolute;
    right: 4px;
    @include backgroundImage(center,center,16px,auto);
    background-image: url("../../../../static/img/search.png");
  }
}
.common-search-input.has-back-icon{
  .search-input {
    background-image: none;
    padding-left: pxToRem(24px);
  }
  .clear-icon{
      right: 32px;
  }
  .search-icon{
    display:block ;
  }
}
.search-hot-words{
  top:pxToRem(100px);
  background-color: #fff;
  .top{
      line-height: pxToRem(65px);
      background-color: #f2f2f2;
      padding:0 pxToRem(30px);
      font-size: 14px;
      color:#959595;
  }
  .list{
      padding:0 pxToRem(30px);
      font-size: 14px;
      color:#353535;
      li{
        line-height: pxToRem(80px);
        border-bottom:1px solid #f5f5f5;
      }
      
  }
  .me-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .del{
        width: 18px;
        height: pxToRem(65px);
        padding:0 20px;
        background-image: url("../../../../static/img/my/del-icon.png");
         @include backgroundImage(center,center,18px,auto); 
      }
  }
  .me-list{
     display: flex;
     justify-content: flex-start;
     background-color: #fff;
     padding:0 pxToRem(30px);
     padding-top: 10px;
     flex-wrap: wrap;
     li{
            line-height: 22px;
            border-radius: 3px;
            display: block;
            color: #686868;
            white-space: nowrap;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            background-color: #f0f2f5;
            padding-left: 13px;
            padding-right: 13px;
            overflow: hidden;
            margin-right: 10px;
             margin-bottom: 10px;
     }
  }
}
</style>
