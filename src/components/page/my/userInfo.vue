<template>
<div>
  <ul class="user-info-wrap">
     <li class="avator">
      <div class="wrap"><span class="text">头像</span>
        <div class="my-avator">
        <userAvatar :uid="info.u_id" :url="info.u_avatar"></userAvatar>
        <!-- <p v-if="info.u_avatar"><img :src="info.u_avatar" class="infoUavatar"></p>
        <p v-else-if="userType==1"><img src="../../../../static/img/my/avatar-1.png"></p>
        <p v-else-if="userType==2"><img src="../../../../static/img/my/avatar-2.png"></p>
        <p v-else><img src="../../../../static/img/my/avatar-3.png"></p> -->
        </div>
       </div>
      <input type="file" accept="image/*" style="opacity:0" @change="imgSelectChange"></li>
     <li @click="handleJump('name',info.u_username)"><span class="text">昵称</span><em>{{info.u_username}}</em></li>
     <li @click="handleJump('tel',info.u_contact_telphone)"><span class="text">联系方式</span><em>{{info.u_contact_telphone?info.u_contact_telphone:"去完善"}}</em></li>
     <li @click="isShowPop=true"><span class="text">性别</span><em>{{sexArr[info.u_sex]?sexArr[info.u_sex]:"去完善"}}</em></li>
     <li class="time"><span class="text">生日</span><yd-datetime type="date" start-date="1940-01-01" v-model="info.u_birthday" slot="right" placeholder="去完善" :init-emit="false" :callback="handleSelectTime"></yd-datetime></li>
  </ul>
  <yd-popup v-model="isShowPop" position="bottom" height="auto" class="sex-pop-wrap">
     <section :class="['item',k==3?'close':'']" @click="handleSelect(k)" v-for="(item,k) in sexArr" :key="k">{{item}}</section>
  </yd-popup>
</div>
</template>
<script>
import Vue from 'vue';
import { Popup } from "vue-ydui/dist/lib.px/popup";
import {DateTime} from 'vue-ydui/dist/lib.px/datetime';
Vue.component(DateTime.name, DateTime);
Vue.component(Popup.name, Popup);
import userAvatar from "./userAvatar"
export default {
  components:{
    userAvatar
  },
  data(){
    return {
      // myCroppa: {},
       info:{
         u_birthday:"",
         u_avatar:"",
         u_username:"",
         u_contact_telphone:"",
         u_sex:"0",
         u_id:"",
       },
       oldBirthday:"",
       sexArr:{
         "1":"男",
         "2":"女",
         "3":"取消"
       },
       isShowPop:false,
       isLoadOver:false,//是否加载完毕
       userType:this.$route.query.utype//获取默认头像
    }
  },
  methods:{
    handleJump(type,info){
      this.$router.push({path:"/index/my_infoSet",query:{
        type:type,
        info:info
      }})
    },
    //上传图片
    imgSelectChange(e){
        const fileInput = e.target
        
        if (fileInput.files.length == 0) {
          return
        }
        if(fileInput.files.length >1){
              this.$toast.error('一次只能选择一张！')
              return
        }
        if (fileInput.files[0].size > 1024 * 1024 * 2) {
            this.$toast.error('图片不能大于2M')
            return;
        }
        const formdata = new FormData();
        formdata.append("file", fileInput.files[0]);
        this.$store.commit('setLoading', true)   
        this.$axios.post("/wap/Upload/upload",formdata)
        .then((res)=>{
          const _data=res.data;
          if(_data.code==0){
            const imgUrl=(_data.data.url||"").replace(/^http:/,'');
             this.setUserInfo({
               u_avatar:imgUrl
             },()=>{
              this.info.u_avatar=imgUrl;
             })
             this.$toast.success("保存成功");
          }else{
             this.$toast.error(_data.message)
          }
          this.$store.commit('setLoading', false)   
        })
    },
    //选择生日
    handleSelectTime(val){
      if(this.oldBirthday==val) return; //未改变，不请求后端
        this.setUserInfo({
          u_birthday:val
        },()=>{
          this.oldBirthday=val;
        })
       
    },
    //选择相别
    handleSelect(k){
      // 性别 1男，2女
       if(k<3 && k!=this.info.u_sex){
         this.setUserInfo({
           u_sex:k
         },()=>{
            this.info.u_sex=k;
         })
       }
       this.isShowPop=false;
    },
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
    //获取个人信息
    getUserInfo(){
      this.$axios.post("/wap/user/getUserInfo")
      .then((res)=>{
          const _data=res.data;
            if(_data.code==0){
                this.oldBirthday=_data.data.u_birthday;
                this.info=_data.data||{}
            }else{
                 this.$toast.error(_data.message)
            }
            this.isLoadOver=true;
            this.$store.commit('setLoading', false)      
      })
  },
  },
  activated(){
    this.getUserInfo();
  },
  created(){
    //保世界 andriod 和ios 上传会执行一个回调 ,防止报错，定义一个
    window.refreshPage=()=>{};
    window.zhuShouCallback=()=>{}
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.sex-pop-wrap{
    .item{
    height: pxToRem(100px);
    line-height:pxToRem(100px);
    text-align: center;
    font-size:18px;  
    color: #000;
    }
    .item:first-child{
      border-bottom: 1px solid #f5f5f5;
    }
    .item.close{
        border-top:pxToRem(13px) solid #E7E7ED;
        display: block;
    };
    
  }
.user-info-wrap{
  background-color: #fff;
  padding: 0 pxToRem(24px);
  
   li{
       height: pxToRem(90px);
      //  line-height: pxToRem(90px);
       border-top:1px solid #f5f5f5;
       display: flex;
       justify-content: space-between;
       align-items: center;
       box-sizing: border-box;
       position: relative;
       .text{
         font-size:16px;
         color: #000;
         flex-shrink: 0;
       }
       em{
         color: #959595;
         width:pxToRem(600px); 
         text-align: right;
         white-space: nowrap;
         text-overflow: ellipsis;
         flex-shrink: 1;
         overflow: hidden;
         font-size:16px;
         padding-right: pxToRem(34px);
       }
       &:after{
          content: "";
          width: 8px;
          height: 8px;
          border-right: 1px solid #E5E5E5;
          border-bottom: 1px solid #E5E5E5;
          position: absolute;
          right: 0;
          top:50%;
          transform: rotateZ(-45deg) translateY(-50%);
       }
       &.time{
         display: block;
         .text{
           position: absolute;
           left:0;
           top:50%;
           transform: translateY(-50%);
           z-index: 1;
         }
         .yd-datetime-input{
           position: absolute;
           z-index: 2;
           right:0;
           top:50%;
           transform: translateY(-50%);
           display: flex;
           align-items: center;
           justify-content: flex-end;
           height: 100%;
           color: #959595;
           font-size:16px;
           text-align: right;
           padding-right: pxToRem(34px);
         }
       }
   }
   li:first-child{
     border-top:none;
   }
   li.avator{
     height: pxToRem(145px);
     display: block;
     input{
      position: absolute;
      top:50%;
      left: 0;
      width: 100%;
      height: pxToRem(145px);
      transform: translateY(-50%)
     }
     .wrap{
       display: flex;
       justify-content: space-between;
       align-items: center;
       height: pxToRem(145px);
     }
     .my-avator{
        width: pxToRem(98px);
        height: pxToRem(98px);
        margin-right: pxToRem(34px);
     }
   }
}
</style>
