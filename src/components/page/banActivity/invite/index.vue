<!-- 2018 中秋节活动 -->
<template>
  <div class="invite-bg"
       :style="{height:height+'px'}">
    <div ref="innerWrap"
         style="padding-bottom:20px">
      <img class="top"
           src="./img/01.jpg">
      <div class="mid">兑换码填写</div>
      <div class="user-input">
        <input type="text"
               placeholder="在此填写兑换码"
               v-model="code"
               maxlength="14">
      </div>
      <div class="btn"
           @click="handleClick">确定</div>
    </div>
    <div v-show="isShowPop">
      <div class="mask"></div>
      <div class="success-pop">
        <i class="close-icon"
           @click.stop="isShowPop=false"></i>
        <section class="pop-btn"
                 @click.stop="handleJump"></section>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      code: "",
      isShowPop: false,
      height: window.innerHeight
    }
  },
  methods: {
    handleJump () {
      this.isShowPop = false;
      this.$router.push("/index/my")
    },
    handleClick () {
      const code = this.code.replace(/\s+/, "");
      if (code == "") {
        this.$toast("请输入兑换码")
        return
      }
      this.$store.commit("setLoading", true);
      this.$axios.post("/wap/Card/setCardByUidAndSn", {
        sn: code
      })
        .then((res) => {
          const _data = res.data;
          this.$store.commit("setLoading", false);
          if (_data.code == 0) {
            this.isShowPop = true;
          } else {
            this.$toast(_data.message)
          }
        })
    },
  },
  created () {
    this.$store.commit("setLoading", false);
  },
  mounted () {
    setTimeout(() => {
      const _height = this.$refs.innerWrap && this.$refs.innerWrap.clientHeight ? this.$refs.innerWrap.clientHeight : 0;
      if (_height > this.height) {
        this.height = _height;
      }
    }, 1000)
  }
}
</script>
<style lang="scss">
@import 'static/css/mixin.scss';
.invite-bg {
  width: 100%;
  background-color: #ce282f;
  background-image: url('./img/bg.png');
  background-size: 100% 100%;
  .btn {
    width: pxToRem(476px);
    height: pxToRem(104px);
    margin: 0 auto;
    line-height: pxToRem(100px);
    font-size: 16px;
    background: linear-gradient(#f6de4c, #fe7f19); /* 标准的语法 */
    color: #7c3c04;
    text-align: center;
    border-radius: pxToRem(104px);
    border: 3px solid #8f1b21;
  }
  .mid {
    height: pxToRem(190px);
    line-height: pxToRem(190px);
    font-size: 24px;
    color: #fef58b;
    text-align: center;
    margin: 0 auto;
    display: block;
  }
  .top {
    // height: 58vh;
    margin: 0 auto;
    display: block;
    //  padding-top:2vh;
  }
  .user-input {
    width: pxToRem(635px);
    margin: 0 auto;
    input {
      display: block;
      width: pxToRem(635px);
      height: 48px;
      line-height: 48px;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: pxToRem(213px);
      padding: 0 pxToRem(40px);
      text-align: center;
      font-size: 14px;
    }
    .btm {
      margin-bottom: 3.2vh;
    }
  }
  .success-pop {
    width: pxToRem(549px);
    height: pxToRem(514px);
    background-image: url('./img/pop.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translateY(-50%);
  }
  .mask {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .close-icon {
    position: absolute;
    right: -5px;
    top: -29px;
  }
  .pop-btn {
    width: pxToRem(350px);
    height: pxToRem(100px);
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: pxToRem(60px);
  }
}
</style>


