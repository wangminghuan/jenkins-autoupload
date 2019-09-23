<!-- 2018 中秋节活动 -->
<template>
 <div class="moon-bg" :style="{height:height+'px'}">
      <div ref="innerWrap" style="padding-bottom:20px">
      <img class="top" src="./img/01.png">
      <img class="mid" src="./img/02.png">
      <div class="user-input">
        <input type="text" placeholder="请输入中秋礼品卡兑换码" v-model="code1" maxlength="8">
        <input type="text" class="btm" placeholder="请输入密钥" v-model="code2" maxlength="6">
      </div>
      <div class="btn" @click="handleClick">确定兑换</div>
      </div>
 </div>
</template>
<script>
export default {
  data() {
    return {
       code1:"",
       code2:"",
       height:window.innerHeight
    }
  },
  methods: {
    handleClick(){
      const code1=this.code1.replace(/\s+/,"");
      const code2=this.code2.replace(/\s+/,"");
      if(code1==""){
        this.$toast("请输入中秋礼品卡卡密")
          return
      }
      if(code2==""){
        this.$toast("请输入卡密")
           return
      }
      this.$store.commit("setLoading", true);
      this.$axios.post("/wap/Card/setCardByUidAndSn",{
        sn:code1+code2
      })
      .then((res)=>{
        const _data=res.data;
        this.$store.commit("setLoading", false);
        if(_data.code==0){
             this.$toast(_data.message)
             setTimeout(()=>{
                this.$router.push("/index/my")
             },2000)
        }else{
          this.$toast(_data.message)
        }
      })
    },
  },
  created(){
    this.$store.commit("setLoading", false);
  },
  mounted(){
    setTimeout(()=>{
      const _height=this.$refs.innerWrap && this.$refs.innerWrap.clientHeight?this.$refs.innerWrap.clientHeight:0;
     if(_height>this.height){
        this.height=_height;
     }
    },1000)
  }
}
</script>
<style lang="scss">
@import 'static/css/mixin.scss';
.moon-bg{
  width: 100%;
  // height: 100%;
  background-image: url("./img/bg.jpg");
  .btn{
     width: pxToRem(470px);
     height:pxToRem(84px);
     background-image:url("./img/btn.png");
     background-size: 100% 100%;
     background-repeat: no-repeat;
     margin:0 auto;
     line-height: pxToRem(84px);
     font-size: 16px;
     color: #151363;
     text-align: center;
  }
  .mid{
    height: 10vh;
    margin:0 auto;
    display: block;
  }
  .top{
   
    height: 58vh;
    margin:0 auto;
    display: block;
    //  padding-top:2vh;
  }
  .user-input{
    width:pxToRem(625px); 
    margin:0 auto;
    input{
      display: block;
      width:pxToRem(625px); 
      height: 38px;
      line-height: 38px;
      border-radius: 38px;
      background-color: #fff;
      margin-bottom: 3.2vh;
      padding:0 pxToRem(40px);
      text-align: center;
      font-size: 12px;
    }
    .btm{
       margin-bottom:3.2vh;
    }
  }
}
</style>


