<!--
  404页面
-->
<template>
  <div class="error-wrap">
      <span><b @click="handleClick">返回首页</b></span>
  </div>
</template>

<script>
export default {
  data(){
    return{
      
    }
    
  },
  methods:{
      handleClick(){
          this.$router.replace("/index/home")
      }
  },
  created(){
    this.$store.commit("setLoading", false)
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
    .error-wrap{
        position: relative;
        height: 100%;
        width: 100%;
        span{
            position: absolute;
            width: pxToRem(300px);
            height: pxToRem(340px);
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%);
            background: url(../../../static/img/other/error-icon.png) no-repeat  ;
            background-size: 100%;
        }
        b{
            position: absolute;
            bottom: pxToRem(-100px);
            left: 0;
            right: 0;
            margin:0 auto;
            line-height: pxToRem(80px);
            width: pxToRem(200px);
            text-align: center;
            font-size: 16px;
            background-color: #dd2727;
            color: #fff;
        }
    }
</style>

