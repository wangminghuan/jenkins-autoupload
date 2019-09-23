<template>
    <div class="outer-wrapper">
        <router-view></router-view>
        <v-menu class="outer-menu"></v-menu>
        <div class="outer-fixed"></div>
    </div>
</template>
<script>
import vMenu from "components/common/menu";
export default {
     components:{
         vMenu
     }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.outer-wrapper{
     position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
   
 .outer-content-wrap{
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
        background: #fff;
    }
        .outer-menu {
            bottom: constant(safe-area-inset-bottom) !important;
            bottom: env(safe-area-inset-bottom) !important;
        }
        .outer-fixed{
            position: fixed;
            bottom: 0;
            left:0;
            right: 0;
            height:constant(safe-area-inset-bottom);
            height:env(safe-area-inset-bottom);
            // box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
            box-sizing: border-box;
            background-color: #fff;
            z-index: 99999;
        }
    .outer-menu{
        position: fixed;
        bottom: 0;
        left:0;
        right: 0;
        height:pxToRem(100px);
        // box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
        box-sizing: border-box;
        border-top:1px solid #f5f5f5;
        background-color: #fff;
        z-index: 9999;
    }
}
</style>


