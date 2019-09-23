<template>
    <ul class="nav-bar-wrap" id="nav-bar-wrap">
        <li :attr-id="$store.state.menu.active"  :class="[item.value,$store.state.menu.active=='/index/'+item.value?'is-active':'']" @click="handleClick(item,index)" v-for="(item,index) in menuArr" :key="index"><i></i><em>{{item.name}}</em><b v-if="item.value=='cart'&& $store.state.cart.nums>0" :class="{'shake':hasClass}">{{(100>$store.state.cart.nums)?$store.state.cart.nums:'99+'}}</b></li>
    </ul>
</template>
<script>
import {getUrlArgs} from "../../utils/utils.js"
export default {
    data(){
        return {
            urlArgs:getUrlArgs(),
            menuArr:[
             {
                 name:"首页",
                 value:"home",
             },{
                 name:"全部分类",
                 value:"classify",
             },{
                 name:"购物车",
                 value:"cart",
             },{
                 name:"我的",
                 value:"my",
             },
            ],
            hasClass:false,
            timer:null,
        }
    },
    computed:{
        nums(){
           return this.$store.state.cart.nums
        }
    },
    methods:{
        handleMaiDiolog(index){
            if(typeof MtaH5 !=="undefined"){
                switch(index){
                    case 0: MtaH5.clickStat("foot_homeicon"); //首页
                    case 1: MtaH5.clickStat("foot_typeicon"); //全部分类
                    case 2: MtaH5.clickStat("foot_carticon"); //购物车
                    case 3: MtaH5.clickStat("foot_myicon"); //我的
                }
            }
        },
        handleClick(item,index){
            this.handleMaiDiolog(index);
            this.$store.commit('setMenuActive', item.value)
            this.$router.push("/index/"+item.value)
        },
    },
    watch:{
        nums(val){
            this.hasClass=true;
            clearTimeout(this.timer);
            this.timer=setTimeout(()=>{
                this.hasClass=false
            },1000)
        }
    },
    created(){
        //激活就展示购物车数量
        if(this.urlArgs.preview==1) return;
         this.getCartNums();//获取购物车数量
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.nav-bar-wrap{
   display: flex;
   justify-content: space-between;
   align-items: center;
   li{
       width: 25%;
       font-size: 12px;
       height: 100%;
       text-align: center;
       display:flex;
       align-items: center;
       justify-content: center;
       flex-direction:column;
       box-sizing: border-box;
       position: relative;
       i{
        @include backgroundImage();
         width: 20px;
         height: 20px;
         margin-bottom:pxToRem(3px);
       }
   }
   li.home i{
       background-image: url("../../../static/img/menu/1.png");
   }
   li.home.is-active i{
        background-image: url("../../../static/img/menu/i-1.png");
   }
   li.classify i{
       background-image: url("../../../static/img/menu/2.png");
   }
   li.classify.is-active i{
        background-image: url("../../../static/img/menu/i-2.png");
   }
   li.cart i{
       background-image: url("../../../static/img/menu/3.png");
   }
   li.cart b{
        color: #fff;
        font-size: 12px;
        position: relative;
        display: inline-block;
        border-radius: 1000px;
        line-height: 1;
        padding: 3px 6px;
        white-space: nowrap;
        background-color: #dd2727;
        -webkit-transform: scale(0.75);
        transform: scale(0.75);
        position: absolute;
        right:pxToRem(50px);
        top: 0;
        &.shake{
            animation: shake 0.5s linear 1;
        }
   }
   li.cart.is-active i{
        background-image: url("../../../static/img/menu/i-3.png");
   }
   li.my i{
       background-image: url("../../../static/img/menu/4.png");
   }
   li.my.is-active i{
        background-image: url("../../../static/img/menu/i-4.png");
   }
}
</style>
