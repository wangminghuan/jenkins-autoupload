   <!-- 店铺首页及分类-->
<template>
 <div class="my-address-wrap">
    <store-home  v-if="isOrder==1" :mid="mid+''"></store-home>
    <storeBranch v-else-if="isOrder==2" :mid="mid+''"></storeBranch>
    <div :class="['navTab',isOrder==1?'':'active'] ">
        <div class="left" @click="setOrderShow(1)">店铺首页</div>
        <div class="right"  @click="setOrderShow(2)">  分类</div>
    </div>
 </div>
</template>
<script>
import storeHome from './storeHome'
import storeBranch from './storeBranch'

export default {
  components: {
    storeHome,
    storeBranch,
  },
  data() {
    return {
      mid:this.$route.query.mid||"",
      isOrder:1,
      list: [
        
      ],

    };
  },
  methods: {
    //   跳转新建地址
    jumpNewAddress() {
        this.$router.push({path:'/index/my_new_address'})
    },
    // 展示第几个 1 全部 2 待付款 3 待发货 4 待收货
    setOrderShow(v){
      // this.$store.commit("setLoading", true);
      this.isOrder=v;
    }

  },
  created() {
    //   this.getCouponList()
  },
  mounted() {
    this.$store.commit("setLoading", false);
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";

.my-address-wrap {
  .navTab{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: pxToRem(100px);
    display: flex;
    background: #fff;
    justify-content: space-around;
    .left,.right{
      text-align: center;
      width: 50%;
      padding-top: pxToRem(50px);
      position: relative;
      transition: all .5s;
    }
    .left{
      background: url('../../../../static/img/store/home-icon.png') no-repeat pxToRem(175px) pxToRem(15px);
      background-size: pxToRem(32px);
      color: #2fb3ff;
    }
    .right{
      background: url('../../../../static/img/store/no-branch-icon.png') no-repeat pxToRem(175px) pxToRem(15px);
      background-size: pxToRem(32px);
      color: #959595;
    }
    
    .left::after{
      content: '';
      position: absolute;
      right: 0;
      top: 10%;
      width: 1px;
      height: 80%;
      background: #959595;
    }
  }
  .active{
    .left{
      background-image: url('../../../../static/img/store/no-home-icon.png');
      color: #959595;
    }
    .right{
      background-image: url('../../../../static/img/store/branch-icon.png');
      color: #2fb3ff;
    }
  }
}
</style>

