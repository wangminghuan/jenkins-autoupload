<template>
<div class="yd-dialog-black-mask" style="z-index:99999">
    <div class="yd-confirm yd-alert set-address-pop">
        <h6>请先设置收货地址</h6>
        <div class="mid"><img src="../../../static/img/my/no-address.png"></div>
        <div class="btn" @click="handleClick">确定</div>
    </div>
</div>
</template>
<script>
export default {
    methods:{
        handleClick(){
            this.$store.commit("setNewAddressPop",false)
            this.$router.push("/index/my_new_address")
        }
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.set-address-pop{
  width: pxToRem(588px);
  border-radius: 6px;
  overflow: hidden;
  h6{
      line-height:pxToRem(166px);
      font-size: 18px;
      color: #fff;
      text-align: center;
      background: linear-gradient(#63cfff, #27a5ff);
  }
  .mid{
      width: pxToRem(320px);
      height:pxToRem(348px);
      margin:0 auto;
      img{
          display: block;
          width: 100%;
          margin-top:pxToRem(90px);
      }
  }
  .btn{
      width: pxToRem(202px); 
      margin:0 auto;
      text-align: center;
      line-height:pxToRem(78px);  
      font-size: 18px;
      color: #fff;
      background-color: #31b3ff;
      border-radius: 6px;
      margin-bottom: pxToRem(60px);
  }
  
}
</style>

