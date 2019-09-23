<template>
  <div class="my-info-set-wrap">
    <div class="input"><input :type="renderData.inputType" :placeholder="renderData.placeholder" v-model="renderData.content" :maxlength="renderData.maxLens"><i class="clear-icon" v-show="renderData.content.length>0" @click.stop.prevent="handleClearInput"></i></div>
     <div :class="['submit',isDisable?'disabled':'']" @click="handleSubmit"><span>确定</span></div>
  </div>
</template>
<script>
export default {
  data(){
    return{
       type:this.$route.query.type,
       allUserData:{
         "name":{
             placeholder:"还是空的，快来取个有逼格的名字吧",
             maxLens:20,
             content:this.$route.query.info||"",
             key:"u_username",
             title:"昵称",
             inputType:"text"
          },
          "tel":{
             placeholder:"请输入联系方式",
             maxLens:11,
             reg:/^1[345789]\d{9}$/,
             content:this.$route.query.info||"",
             key:"u_contact_telphone",
             title:"联系方式",
             inputType:"number"
          }
       }
    }
  },
  computed:{
    renderData(){
      return this.allUserData[this.type] ||{}
    },
    isDisable(){
      return this.renderData.content  && this.renderData.content.length>0 && ( typeof this.renderData.reg =="undefined" || this.renderData.reg.test(this.renderData.content) )?false:true
    }
  },
  methods:{
    //设置个人信息
    setUserInfo(obj,callback){
      this.$store.commit('setLoading', true)   
      this.$axios.post("/wap/User/setUserInfo",obj)
      .then((res)=>{
          const _data=res.data;
            if(_data.code==0){
                 this.$toast.success("保存成功");
                 callback && callback();
            }else{
                 this.$toast.error(_data.message)
            }   
            this.$store.commit('setLoading', false)      
      })
    },
    //清除输入
      handleClearInput(){
        this.renderData.content="";
      },
      //提交保存
      handleSubmit(){
      if(this.isDisable) return;
      const obj={};
      obj[this.renderData.key]=this.renderData.content;
          this.setUserInfo(obj,()=>{
            setTimeout(()=>{
              window.history.go(-1)
            },1000)
          })
      } 
  },
  created(){
    this.$setTitle(this.renderData.title);
    this.$store.commit('setLoading', false)   
  },
  
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.my-info-set-wrap{
  .input{
     margin-top:pxToRem(20px);
     position: relative;
  }
  input{
    width: 100%;
    line-height: 20px;
    padding: pxToRem(30px) pxToRem(30px);
    background-color: #fff;
    font-size: 16px;
   
    color: #1E1E1E;
  }
  .submit{
    width:pxToRem(690px);
    height:48px;
    // line-height:48px; 
    background-color:#DD2727;
    
    border-radius:24PX;
    margin:0 auto;
    font-size:18px;
    font-weight:400;
    color:#FFFFFF;
    text-align: center;
    margin-top: pxToRem(56px);
    margin-bottom: pxToRem(56px);
    position: relative;
    span{
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      left:0px;
      right: 0px;
      margin:0 auto;
      width: pxToRem(100px);
    }
  }
  .submit.disabled{
   background-color:#DDDDDD;
  }
  .clear-icon{
    width: 28px;
    height: pxToRem(64px);
    position: absolute;
    right: 4px;
    @include backgroundImage(center,center,14px,auto);
    background-image: url("../../../../static/img/s-close.png");
    top:50%;
    transform: translateY(-50%);
  }
}
</style>

