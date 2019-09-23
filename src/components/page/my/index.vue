<!-- 我的首页 -->
<template>
     <div class="my-wrap common-scroll-wrap">
         <div class="common-scroll-view">
         <section class="top">
             <div class="avatar" @click="handleJumpMyCenter">
               <userAvatar :uid="uid" :url="userAvatarImg"></userAvatar><i></i></div>
             <p class="name">{{userName}}</p>
             <ul class="menu">  
                 <li class="all" @click="jumpOrder('-1')"><i></i><em>全部</em></li>
                 <li class="pay" @click="jumpOrder('0')"><i></i><em>待付款</em><b v-if="total_waiting_pay">{{total_waiting_pay}}</b></li>
                 <li class="deliver" @click="jumpOrder('1')"><i></i><em>待发货</em><b v-if="total_waiting_ship">{{total_waiting_ship}}</b></li>
                 <li class="take" @click="jumpOrder('2')"><i></i><em>待收货</em><b v-if="total_waiting_recipt">{{total_waiting_recipt}}</b></li>
             </ul>
         </section>
         <ul class="btm"> 
             <router-link class="adress arrow-icon" tag="li" to="/index/my_address"><i></i><em>地址管理</em></router-link>
             <router-link class="oupon arrow-icon" tag="li" to="/index/my_coupon"><i></i><em>优惠券</em></router-link>
             <router-link class="card arrow-icon" tag="li" to="/index/my_shop_card"><i></i><em>购物卡</em></router-link>
             <router-link class="help arrow-icon" tag="li" to="/index/my_customer_help"><i></i><em >帮助与客服</em></router-link>
             <router-link class="week arrow-icon" tag="li" to="/index/my_week_share"><i></i><em>每周分享</em></router-link>
         </ul>
         </div>
     </div>
</template>
<script>
import userAvatar from "./userAvatar"
export default {
  components:{
    userAvatar
  },
    data(){
        return{
            // isLoadOver:false,
            uid:"",
            userName:"",
            userAvatarImg:"",
            total_waiting_pay:"", //待付款订单数量
            total_waiting_ship:"", //待发货订单数量
            total_waiting_recipt:""  //待收货订单数量
        }
    },
    methods:{
      //进入个人中心
      handleJumpMyCenter(){
        this.$router.push({path:'/index/my_userinfo'})
      },
        //跳转订单状态  1 全部 2 待付款 3 待发货 4 待收货
        jumpOrder(v){
            this.$router.push({path:'/index/order_status',query:{tab:v}})
        },
        getUserName(){
            this.$axios.post("/wap/user/getUserInfo")
            .then((res)=>{
                const _data=res.data;
                  if(_data.code==0){
                      this.uid=_data.data.u_id+'';
                      this.userName=_data.data.u_username;
                      this.userAvatarImg=_data.data.u_avatar;
                  }else{
                      this.userName="未知用户"
                  }
                  // this.isLoadOver=true;
                  this.$store.commit('setLoading', false)      
            })
        },
        getUserNum(){
            this.$axios
                .post("/wap/Order/getOrderNumByUid")
                .then(res=>{
                    const _data = res.data;
                    if(_data.code == 0){
                        this.total_waiting_pay = _data.data.total_waiting_pay;
                        this.total_waiting_ship = _data.data.total_waiting_ship;
                        this.total_waiting_recipt = _data.data.total_waiting_recipt;
                    }else{

                    }
                })
        }
    },
    activated(){
        this.getUserName();
        this.getUserNum();
    }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.my-wrap{
    .top{
        background-image: url("../../../../static/img/my/bg.jpg");
        @include backgroundImage();
        // height: pxToRem(472px);
        height: pxToRem(420px);
        // margin-bottom:pxToRem(100px);
        margin-bottom:pxToRem(120px);
        position: relative;
    }
    .avatar{
            width:70px; 
            height:70px; 
            box-sizing: border-box;
            border-radius: 50%;
            position: absolute;
            top:50%;
            transform: translateY(-50%);
            left:0;
            right: 0;
            margin:0 auto;
            border:2px solid #fff;
          
             i{
               position: absolute;
               width:pxToRem(46px); 
               height:pxToRem(46px);
               background-color: #fff;
               border-radius: 50%;
               bottom: 0;
               right: 0;
               transform: translate3d(10%,10%,0);
               @include backgroundImage(center,center,pxToRem(24px),pxToRem(24px));
               background-image: url("../../../../static/img/my/edit-myinfo.png");
             }
    }
    .name{
      text-align: center;
      font-size: 16px;
      color: #fff;
      position: absolute;
        top:50%;
        transform: translateY(-50%);
        left:0;
        right: 0;
        margin:0 auto;
        margin-top:pxToRem(110px);
    }
    .menu{
      position: absolute;
      width:pxToRem(693px); 
      height:pxToRem(157px) ;
      border-radius: 6px;
    //   bottom:pxToRem(-157px)/2;
      bottom:pxToRem(-180px)/2;
      background-color: #fff;
      margin:0 auto;
      left:0;
      right: 0;
      display: flex;
      align-items: center;
      li{   
            position: relative;
            text-align: center;
            display:flex;
            align-items: center;
            justify-content: center;
            flex-direction:column;
            box-sizing: border-box;
            width: 25%;
            height: 100%;
          i{
            margin-bottom:pxToRem(14px) ;
            @include backgroundImage();
            align-self:center;
          }
          em{
               align-self:center;
          }
          b{
              position: absolute;
              min-width:pxToRem(30px);
              min-height:pxToRem(30px);
              border:1px solid #f3bd50;
              background:#fff;
              font-size: pxToRem(18px);
              color:#f3bd50;
              text-align: center;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
          }
      }
      li.pay b{
          top:pxToRem(30px);
          left:pxToRem(100px);
      }
      li.deliver b{
          top:pxToRem(30px);
          left:pxToRem(100px);
      }
      li.take b{
          top:pxToRem(30px);
          left:pxToRem(100px);
      }
      li.all i{
          width: pxToRem(48px);
          height:pxToRem(50px);
          background-image: url("../../../../static/img/my/1-1.png");
      }
      li.pay i{
          width: pxToRem(45px);
          height:pxToRem(50px);
          background-image: url("../../../../static/img/my/1-2.png");
      }
      li.deliver i{
          width: pxToRem(54px);
          height:pxToRem(48px);
          background-image: url("../../../../static/img/my/1-3.png");
      }
      li.take i{
          width: pxToRem(54px);
          height:pxToRem(48px);
          background-image: url("../../../../static/img/my/1-4.png");
      }
    }
    ul.btm{
        background-color: #fff;
     li{
      height: pxToRem(95px);
      line-height: pxToRem(95px);
      padding-left:pxToRem(30px);
      display: flex;
      align-items: center;
      position: relative;
       box-sizing: border-box;
      i{
          width: pxToRem(66px);
          height:100%;
          flex-shrink:0;
          margin-right:pxToRem(10px) ;
          @include backgroundImage();
      }
      em{
          width: 100%;
          flex-shrink:1;
          border-bottom: 1px solid #f5f5f5;
          box-sizing: border-box;
          font-size: 14px;
          color: #333333;
      }
      &:last-of-type em{
          border:0;
      }
    }
    li.adress i{
        background-image: url("../../../../static/img/my/1.png");
        background-size: pxToRem(38px) auto;
    }
    li.oupon i{
        background-image: url("../../../../static/img/my/2.png");
        background-size: pxToRem(40px) auto;
    }
    li.card i{
        background-image: url("../../../../static/img/my/3.png");
        background-size: pxToRem(40px) auto;
    }
    li.help i{
        background-image: url("../../../../static/img/my/4.png");
        background-size: pxToRem(49px) auto;
    }
    li.week i{
        background-image: url("../../../../static/img/my/5.png");
        background-size: pxToRem(38px) auto;
    }
    }

}
</style>