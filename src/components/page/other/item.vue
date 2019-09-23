<!-- 列表页面和搜索结构可公用的商品单元组件 -->
<template>
  <section :class="['good-item-wrap',hasClick?'is-click':'']" @click="handleClick">
      <div class="pic"><img v-lazy="list.g_images"></div>
      <div class="cont">
          <h6 class="titl">{{list.g_name}}</h6>
          <div class="btm">
          <p class="price"><i>￥</i><b>{{list.g_price}}</b></p>
          <ul class="tag" v-show="tagArr.length>0">
              <li v-for="(n,i) in tagArr" :key="i">{{n}}</li>
          </ul>
          </div>
      </div>
  </section>
</template>
<script>
export default {
    props:{
        list:Object,
        hasClick:{
            type:Boolean,
            value:false
        }
    },
    data(){
        return{
            clicked:this.hasClick
        }
    },
    computed:{
       tagArr(){
         return ((typeof this.list.g_tags=='string' && this.list.g_tags!="")?this.list.g_tags.split(','):[])
       }
    },
    watch:{
        hasClick(val){
            this.clicked=val;
        },
        clicked(val){
          this.$emit('update:hasClick', val)
        }

    },
    methods:{
        handleClick(){
            this.clicked=true;
            this.$router.push({path:"/index/detail",query:{
                id:this.list.g_id,
                gsn:this.list.g_sn
            }}) 
        }
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
$lazyBackColor:#f5f5f5;
.good-item-wrap{
    display: flex;
    position: relative;
    // justify-content: space-between;
    background-color: #fff;
    padding:pxToRem(30px);
    &::after{
        content: "";
        display: block;
        position: absolute;
        bottom:0;
        left:0;
        right: 0;
        height: 1px;
        margin:0 auto;
        width: pxToRem(690px);
        background-color: #e5e5e5;
    }
    .pic{
        width:pxToRem(200px);
        height:pxToRem(200px);
        overflow: hidden;
        background-color: $lazyBackColor;
        flex-shrink:0;
        margin-right: pxToRem(23px);
        position: relative;
        border:1px solid  #e5e5e5;
        img{
            @include imgCenter()
        }
    }
    .titl{
        line-height: pxToRem(40px);
        color: #353535;
        font-size: 14px;
        overflow: hidden;
        text-overflow:ellipsis;//文本溢出显示省略号
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .cont{
        position: relative;
    }
    .btm{
        position: absolute;
        bottom:2px;
        left:0; 
    }
    .price{
        color: #dd2727;
        font-size: 16px;
        margin-bottom:pxToRem(20px);
        i{
            font-size: 10px;
        }
    }
    .tag{
        display: flex;
        overflow: hidden;
        width: pxToRem(420px);
        height: 20px;
        flex-wrap: wrap;
        li{
            padding:0 pxToRem(10px);
            height:20px;
            line-height: 20px;
            border-radius: 4px;
            border:1px solid #f5f5f5;
            color:#dd2727; 
            margin-right:pxToRem(14px);
            box-sizing: border-box;
            flex-shrink: 0;
            box-sizing: border-box;
        }
        li:last-child{
            margin-right: 0
        }
    }
}
.good-item-wrap.is-click .titl{
    color: #d8d8d8
}
</style>

