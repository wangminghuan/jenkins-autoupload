   <!-- 我的购物卡 -->
<template>
 <div class="my-help-wrap">
    <div class="help-box">
      <h4>常见问题</h4>
      <ul class="commonProblem">
        <li  @click="jumpHelpDetial(1)"> <div class="left">发货时间</div><div class="right arrow-icon"></div></li>
        <li  @click="jumpHelpDetial(2)"> <div class="left">快递及配送</div><div class="right arrow-icon"></div></li>
        <li  @click="jumpHelpDetial(3)"> <div class="left">优惠券与购物卡</div><div class="right arrow-icon"></div></li>
        <li  @click="jumpHelpDetial(4)"> <div class="left">商品错发漏发</div><div class="right arrow-icon"></div></li>
        <li  @click="jumpHelpDetial(5)"> <div class="left">商品退换货</div><div class="right arrow-icon"></div></li>
        <li  @click="jumpHelpDetial(6)"> <div class="left">注销账户</div><div class="right arrow-icon"></div></li>
      </ul>
    </div>
    <div class="help-box">
      <h4>在线客服</h4>
      <ul class="commonProblem">
        <li >
          <div class="left">服务时间</div>
          <div class="rt">周一至周五  08:30-18:00</div>
        </li>
        <li >
          <div class="left">服务热线</div>
          <div class="right arrow-icon" @click="handleJumpTel('037188865188')">0371-88865188</div>
        </li>
      </ul>
    </div>
    <div class="service">
      <img src="../../../../static/img/my/service-phone.png" alt="">
      <span @click="setDialing" ></span>
    </div>
 </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  methods: {
    handleJumpTel(tel){
      //保世界调取客户端方法打电话
      if(this.$agent==2 && typeof CustomJS!=="undefined" && CustomJS.dail ){
          this.$dialog(tel,()=>{
              CustomJS.dail(tel)
          },'拨打电话')
      }else{
        window.location.href="tel:"+tel
      }
       
    },
    // 跳转问题详情
    jumpHelpDetial(id) {
      this.$router.push({ path: "/index/help" ,query:{id:id}});
    },
    setDialing(){
      // this.$toast("维护中，敬请期待！");
      // return;
      const token=this.getCookie("__m_token__");
      window.location.href="//"+(window.location.port?"s29.dev.bxd365.com":"s29.9956.cn")+"/res/common/im_v1/wap.html?wap_token="+token+"&m_id=-1";
    }
  },
  created() {
  },
  mounted() {
    this.$store.commit("setLoading", false);
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-help-wrap {
  // padding-top: pxToRem(32px);
  .help-box{
    background: #fff;
    line-height: pxToRem(87px);
    font-size: 15px;
    h4{
      padding:0 pxToRem(24px);
      background: #f8f8f8;
    }
    .commonProblem{
      padding:0 pxToRem(24px);
      li{
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #f5f5f5; 
        background: #fff;
        .right,.rt{
          color: #959595;
          padding-right:pxToRem(30px); 
          position: relative;
        }
        .arrow-icon::after{
          right:0;
        }
       
      }
      li:nth-child(1){
        border:0; 
      }
    }
  }
  .service{
    position: relative;
    img{
      display: block;
      width: 100%;
    }
    span{
      position: absolute;
      width: pxToRem(200px);
      height: pxToRem(50px);
      bottom: pxToRem(40px);
      right: pxToRem(114px);
      // background: #000;
      border-radius: 20px;
      display: block;
    }
  }
  
 
}
</style>

