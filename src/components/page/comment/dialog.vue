<template>
  <transition name="message-box-pop">
    <div class="message-box-outer" v-show="isShow">
    <div :class="['my-message-box']">
      <div class="title">您尚未发布</div>
      <div class="content">是否对已编辑内容进行保存</div>
      <div class="btn-wrap">
        <span @click="handleClose">不保存</span>
        <em @click="handleSave">保存</em>
      </div>
    </div> 
    <div class="mask" @touchmove.prevent></div>
    </div>
  </transition>
</template>
<script>
export default {
  props:{
    value:{
      type:Boolean,
      value:false
    },
    handleCallBack:{
      type:Function,
      value:()=>{}
    },
  },
  data(){
    return{
       isShow:this.value
    }
  },
  methods:{
    handleSave(){
      this.handleCallBack(1);
    },
    handleClose(){
      this.handleCallBack(0);
    }
  },
  watch:{
      value(val){
        this.isShow=val
      }
  },
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.message-box-outer{
.mask{
  position: fixed;
  top:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  left:0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
}
.my-message-box{
  width: pxToRem(540px);
  position: fixed;
  top:40%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin:0 auto;
  background-color: #fff;
  border-radius: 7px;
  transition:0.2s;
  z-index: 9999;
  .title{
    font-size:18px;
    font-weight:400;
    color:rgba(0,0,0,1);
    text-align: center;
    margin-top:pxToRem(40px);
  }
  .content{
    font-size:15px;
    font-weight:400;
    color:rgba(149,149,149,1);
    line-height:24px;
    text-align: center;
    padding:pxToRem(16px) 0 pxToRem(28px) 0;
  }
  .btn-wrap{
    height: pxToRem(100px);
    display: flex;
    justify-content: space-between;
    border-top:1px solid #f5f5f5;
    align-items: center;
    overflow: hidden;
    span,em{
      width: 50%;
      line-height:pxToRem(100px); 
      text-align: center;
      font-size:18px;
      font-weight:400;
      color:rgba(0,0,0,1);
      border-bottom-right-radius: 7px;
    }
    em{
      color: #fff;
      background:linear-gradient(135deg,rgba(221,24,16,1) 0%,rgba(219,29,29,1) 100%);
      box-shadow:0px 2px 4px 0px rgba(219,30,32,0.2);
    }
  }
}
.message-box-pop-enter .my-message-box{
  opacity: 0;
  // transform: scale(0.7);
  transform: translateY(-50%) scale(0.7) ;
}
.message-box-pop-leave-active .my-message-box{
  opacity: 0;
  transform: translateY(-50%) scale(0.9) ;
}

</style>
