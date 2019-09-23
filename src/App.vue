<template>
  <div id="app">
    <loading v-if="!hideLoading" :show="$store.state.loading.isShow"></loading>
    <navigation>
       <router-view></router-view>
    </navigation>
    <alert-set-address v-if="$store.state.adpop.isShow" ></alert-set-address>
    </div>
</template>

<script>
import vconsole from 'vconsole';
import Loading  from "./components/common/loading"
import alertSetAddress from "./components/common/alertSetAddress"
export default {
  name: 'App',
  components: {
    Loading,
    alertSetAddress
  },
  data(){
    return {
      hideLoading:false,//debug模式隐藏loading,方便调试
    }
  },
  methods:{
  },
  created(){
    if(window.location.search.match("debug=true")){
        this.hideLoading=true;
        new vconsole(); //url里面有debug参数进入调试模式
    } 
  }
}
</script>

<style lang="scss">
@import "../static/css/reset.scss";
@import "../static/css/mixin.scss";
@import 'vue-ydui/dist/ydui.base.css';
@supports (bottom: constant(safe-area-inset-bottom)) {
  body {
    padding-bottom: constant(safe-area-inset-bottom);
  }
}
body{
  background-color: #f5f5f5;
}
body,html,#app{
width: 100%;
height: 100%;
}

#app{
  //  -webkit-font-smoothing: antialiased;
  //   -moz-osx-font-smoothing: grayscale;
  //   -webkit-user-select: none;
  //   -moz-user-select: none;
  //   -ms-user-select: none;
  //   user-select: none;
  //   touch-action: manipulation;
  //   -webkit-text-size-adjust: none;
  //   text-size-adjust:none;
    // &::-webkit-scrollbar{
    //   width: 0;
    //   background: transparent
    // }
    .app-view-wrap{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  .yd-backtop{
    width: 40px;
    height: 40px;
    right: 10px;
    bottom: 60px;
    &::after{
      font-size: 22px
    }
  }
  .scrollbar-hide::-webkit-scrollbar{
      width: 0;
      background: transparent
   }
  /* recommended css code for vue-svgicon */
   .svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: inherit;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
}

.svg-fill {
    fill: currentColor;
    stroke: none;
}

.svg-up {
    /* 默认 */
    transform: rotate(0deg);
}

.svg-right {
    transform: rotate(90deg);
}

.svg-down {
    transform: rotate(180deg);
}

.svg-left {
    transform: rotate(-90deg);
}
}

.arrow-icon{
  position: relative;
  &:after{
        content: "";
        background-image: url("../static/img/arrow.png");
        @include backgroundImage();
        height: pxToRem(24px);
        width: pxToRem(14px);
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        right:pxToRem(30px);
      }
}
.close-icon{
  @include backgroundImage(center,center,16px,16px);
   background-image: url("../static/img/close.png");
   height: 30px;
   width:30px;
   display: block;
}
.common-checkbox-icon {
    border: 1px solid #ccc;
    border-radius: 2px;
    display: inline-block;
    position: relative;
    z-index: 10;
    vertical-align: bottom;
    pointer-events: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #f23030;
    i {
      content: "";
      position: absolute;
      top: 45%;
      left: 50%;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: translate(-50%, -50%) rotate(45deg) scale(1);
      width: 0;
      height: 0;
      transition: all 0.2s ease-in-out;
      opacity: 0;
    }
  }
  .common-checkbox-icon.checked {
    background-color: #f23030;
    border-color: #f23030; 
    i {
      width: 5px;
      height: 11px;
      opacity: 1.0;
    }
  }
  .common-scroll-wrap{
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .common-scroll-view{
     position: absolute;
      z-index: 999;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      transition: transform .4s cubic-bezier(.55,0,.1,1),-webkit-transform .4s cubic-bezier(.55,0,.1,1);
      will-change: transform;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar{
      width: 0;
      background: transparent
   }
  }
  // .my-yd-backtop {
  //   border: 1px solid #C0C0C0;
  //   width: 40px;
  //   height: 40px;
  //   background-color: rgba(255, 255, 255, .85);
  //   position: fixed;
  //   border-radius: 50%;
  //   right: 10px;
  //   bottom: 60px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   z-index: 1000;
  //   &:after {
  //     font-family:"YDUI-INLAY";
  //     content: '\E788';
  //     font-size: 22px;
  //     color: #C0C0C0;
  //   }
  // }
</style>
