<template>
  <div :class="['rate-wrap',disabled?'':'rate-max']">
    <svgicon @click="handleClick(index)" name="rate" :width="width" :height="height" :color="index<=stars?'#EF2610':'#D0D0D0'" v-for="index in max"  :key="index"></svgicon>
  </div>
</template>
<script>
import "../../common/svg/rate.js";
export default {
  props:{
    max:{
      type:Number,
      default:5
    },
    disabled:{
      type:Boolean,
      default:false
    },
    width:{
      type:String,
      default:'16'
    },
    height:{
      type:String,
      default:'16'
    },
    value:{
      type:[Number,String],
      default:0
    },
  },
  data(){
    return{
      stars:parseInt(this.value)||0
    }
  },
  watch:{
     value(val){
        this.stars=parseInt(val)||0
     }
  },
  methods:{
    handleClick(index){
      if(this.disabled) return;
      this.stars=index;
      this.$emit("input",this.stars)
    }
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.rate-wrap{
  display: flex;
  height: 40px;
  align-items: center;
  svg{
    margin-right: pxToRem(8px);
  }
  svg:last-child{
    margin-right:0;
  }
  &.rate-max{
    svg{
    margin-right: pxToRem(14px);
  }
  }
}
</style>

