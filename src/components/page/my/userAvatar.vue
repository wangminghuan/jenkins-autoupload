<template>
 <!-- 用户头像 含默认头像的设置，前端配置 -->
  <div class="common-avator-wrap" ref="commonAvator" :style="myStyle">
  <section :style="myStyle" v-if="url"><img :src="url+ '?x-oss-process=image/resize,m_fill,h_200,w_200'"></section>
  <section :style="myStyle" v-else-if="userType==1"><img src="../../../../static/img/my/avatar-1.png"></section>
  <section :style="myStyle" v-else-if="userType==2"><img src="../../../../static/img/my/avatar-2.png"></section>
  <section :style="myStyle" v-else-if="userType==3"><img src="../../../../static/img/my/avatar-3.png"></section>
  </div>
</template>
<script>
export default {
  props:{
    uid:{
      type:[String,Number],
      value:""
    },
    url:{
      type:String,
      value:""
    }
  },
  data(){
    return {
      myStyle:{}
    }
  },
  computed:{
        userType(){
           const _id=this.uid+'';
           return parseInt(_id.substring(_id.length-1))%3+1
        },
    },
    mounted(){
      const parent=this.$refs.commonAvator.parentNode;
      if(parent){
        this.myStyle={
          width:parent.clientWidth+'px',
          height:parent.clientHeight+'px',
        }
      }
    }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.common-avator-wrap{
  position: relative;
  section{
        // width:pxToRem(132px); 
        // height:pxToRem(132px) ;
        overflow: hidden;
        border-radius: 50%;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        left:0;
        right: 0;
        margin:0 auto;
        background-color: #f5f5f5;
        overflow: hidden;
        img{
            @include imgCenter();
            border-radius: 50%;
        }
        }
}
</style>

