<!-- 全部分类首页 -->
<template>
     <div class="classify-wrap common-scroll-wrap" :style="{'height':scrollHeight+'px'}">
        <div class="common-scroll-view">
        <div class="scroll-wrap">
            <ul class="scrolltab-nav scrollbar-hide" style="scrollStyle">
                <li v-for="(item,index) in cateArr" :key="index" :class="item.active?'active':''" @click="handleClickNav(index)" ref="tabNav">{{item.label}}</li>
            </ul>
            <section class="scrolltab-content scrollbar-hide" ref="scrollContent">

                <p>猜你想找</p>
                <ul class="goods-wrap">
                    <li class="goods-item" v-for="(item,index) in subCateArr" :key="index" @click="handleClick(item)">
                        <i><img :src="item.icon"></i><em>{{item.label}}</em>
                    </li>
                </ul>
            </section>
        </div>
        </div>
     </div>
</template>
<script>
import {getClientHeight} from "../../../utils/utils.js";
export default {
    data(){
        return{
            scrollStyle:{},
            scrollHeight:"",
            itemHeight:0,
            cateArr:[],
            subCateArr:[],
        }
    },
    methods:{
        handleClick(item){
            this.$router.push({path:"/index/list",query:{
                p:item.label,
                cid:item.value,
                }})
        },
        handleClickNav(indx){
            if(typeof MtaH5 !=="undefined"){
                if(indx == '0'){
                    MtaH5.clickStat("Category-one")
                }else if(indx == '1'){
                    MtaH5.clickStat("Category-tow")
                }else if(indx == '2'){
                    MtaH5.clickStat("Category-three")
                }else if(indx == '3'){
                    MtaH5.clickStat("Category-four")
                }
            };
            this.subCateArr=this.cateArr[indx].children
            this.cateArr.map((item,index)=>{
                indx==index?item.active=1:item.active=0;
            })
            this.$refs.scrollContent.scrollTop=0;
        },
        getGoodsParentClassify(){
            this.$axios.post("/wap/Category/tree")
            .then((res)=>{
              const _data=res.data;
              if(_data.code==0){
                  _data.data.map((item,index)=>{
                       index==0?item.active=1:item.active=0
                  })
                  this.cateArr=_data.data;
                  this.subCateArr=this.cateArr[0].children;
                  setTimeout(()=>{
                        this.itemHeight=this.$refs.tabNav && this.$refs.tabNav[0] && this.$refs.tabNav[0].clientHeight;
                  },0) 
              }
              this.$store.commit('setLoading', false);
            })
        }
    },
    created(){
        this.getGoodsParentClassify()
    },
    mounted(){
        this.scrollHeight= getClientHeight()-(document.getElementById("nav-bar-wrap").clientHeight);
    }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$lazyBackColor:#f5f5f5;
.classify-wrap{
    .scroll-wrap{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
    }
    .scrolltab-nav{
        height: 100%;
        width:pxToRem(210px); 
        background-color: #f5f5f5;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        z-index: 1;
        transition: all 0.2s linear;
        li{
            height: pxToRem(90px);
            line-height: pxToRem(90px);
            text-align: center;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            &:before{
              content: "";
              width: pxToRem(150px);
              height: 1px;
              background-color: #e5e5e5;
              position: absolute;
              bottom:0;
              left: 0;
              right: 0;
              margin: 0 auto;
            }
        }
        li.active{
            background-color: #fff;
            &:after{
              content: "";
              width: 4px;
              height: 100%;
              background-color: #2fb3ff;
              position: absolute;
              bottom:0;
              left: 0;
              top:0;
            }
        }
    }
    .scrolltab-content{
        height: 100%;
        background-color: #fff;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        padding: pxToRem(20px) 0;
        position: relative;
        p{  
            font-size: 13px;
            color:#353535;
            line-height: pxToRem(72px);
            padding-left:pxToRem(45px);
        }
        .goods-wrap{
            display: flex;
            flex-wrap: wrap;
            justify-content:flex-start;
        }
        .goods-item{
            height: pxToRem(200px);
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 33.3%;
           i{
            width: pxToRem(100px);
            height: pxToRem(100px);
            // background-color: #67c5fa;
            margin-bottom:pxToRem(14px);
           } 
           em{
               font-size: 13px;
               white-space: nowrap;
               overflow: hidden;
               width: 90%;
               text-align: center;
               text-overflow: ellipsis;
           }
        }
    }
}
</style>