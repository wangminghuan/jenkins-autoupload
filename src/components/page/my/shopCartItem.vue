<template>
     <li :class="['shop-card-item', item.cdu_type==1?'unactive':'']">
            <div class="circular"></div>
            <div class="card-info" @click="handleClick(item)">
              <div class="top">
                <!-- <div class="left">{{(item.cd_name||"极夫特商城储蓄卡")+'x'}}<span>商城购物卡</span></div> -->
                <div class="left"><span>{{(item.cd_name||"极夫特商城储蓄卡")}}&nbsp;</span></div>
                <div class="right" v-if="item.cdu_sn">NO. {{item.cdu_sn}}</div>
              </div>
              <div class="center">
                <div class="left"><em>余</em><em>额</em></div>
                <div class="right"><span>{{item.cdu_balance}}</span><b>&nbsp;元</b></div>
                <!-- <div class="right">
                  <span @click="handleClick(item)">立即使用</span>
                </div> -->
              </div>
              <div class="bottom" v-if="item.cd_startTime && item.cd_endTime">
                {{"有效时间："+(fixTime(item.cd_startTime)+"-"+fixTime(item.cd_endTime))}}
              </div>
              <!-- 保世界app中且有转赠标识才展示按钮 -->
              <div class="transfer-logo" @click.stop="handleTransfer " v-if="item.cd_isTransfer==1 && $agent==2">转赠</div>
            </div>
         </li>
</template>
<script>
export default {
    props:{
       item:{
           type:Object,
           value:{}
       },
       handleClick:{
            type:Function,
            value:()=>{}
       },
    },
    methods:{
      //向后台发送该卡是可以被赠送的标识，安全用途
      sendHasShare(){
        this.$axios.post("/wap/Card/cardTransferShare",{
            cdu_id:this.item.cdu_id
        })
      },
      fixTime(time){
        //将 2018-07-26 11:11:55 修正为 2018/07/26
        const _time=typeof time=="string"?time:"0-0-0"
        let timeArr=_time.split(" ");
        let timeDate=timeArr[0]?timeArr[0]:"";
        return timeDate.split("-").join("/")
       },
       handleTransfer(){
         const tel=(localStorage.getItem('__m_user_tel__')||"").replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
         const shareConfig={
           title:"好友赠您一张新春购物卡",
           content:"全场通用，直抵现金，速速领取兑好礼！",
           imgUrl:(!!window.location.port?"http://s29.dev.bxd365.com":"http://s29.9956.cn")+"/static/giftmall_app/img/card-share.jpg",
           shortlink:(!!window.location.port?"http://m.newgiftmall.com:8001":"https://m.newgiftmall.com")+"/index/transfer?_key="+this.$base64url(`tel=${tel}&id=${this.item.cdu_id}&sn=${this.item.u_sn}&time=${typeof this.item.cd_endTime=='string'?this.item.cd_endTime.split(' ')[0]:''}&price=${this.item.cd_faceValue}`),
           platfrom:""
         }
         console.log(shareConfig)
         if (typeof CustomJS !== "undefined" && CustomJS.share) {
          this.sendHasShare();
          CustomJS.share(JSON.stringify(shareConfig));
         }
       }
    }
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.shop-card-item {
    width: pxToRem(690px);
    position: relative;
    overflow: hidden;
    background-image: -webkit-linear-gradient(top, #5b91ff, #5b83f5, #5b91ff);
    margin: 0 auto pxToRem(24px);
    border-radius: 8px;
    .circular {
      position: absolute;
      background-image: -webkit-linear-gradient(top, #5063e5, #5091ff, #5091ff);
      z-index: 0;
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
      width: pxToRem(1200px);
      height: pxToRem(1200px);
      left: pxToRem(100px);
      top: pxToRem(-100px);
    }
    .card-info {
      z-index: 1;
      position: relative;
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 12px;
      padding: pxToRem(30px) pxToRem(35px) pxToRem(38px) pxToRem(45px);
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: pxToRem(88px);
        .left {
          color: #a2adf0;
          white-space: nowrap;
          flex-shrink: 1;
          overflow: hidden;
          margin-right: 4px;
          text-overflow: ellipsis;
          span {
            font-style: oblique;
            font-weight: 900;
            font-size: 14px;
          }
        }
        .right {
          font-weight: 400;
          flex-shrink: 0;
          // font-size: 14px;
        }
      }
      .center {
        display: flex;
        justify-content: flex-start;
        margin-bottom: pxToRem(30px);
        font-size: 16px;
        align-items: flex-end;
        .right {
          flex-shrink: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            font-size: 40px;
            line-height: 1;
          }
        }
        .left {
          color: #486aeb;
          flex-shrink: 0;
          display: flex;
          margin-bottom: 2px;
          em{
            font-size: 12px;
            width:22px;
            height: 22px;
            border-radius: 50%;
            color:  #4679fc;
            background-color:#adc6fd;
            line-height: 22px;
            text-align: center;
            margin-right: 4px;
          }
        }
      }
      .bottom {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #ffffff
      }
      .transfer-logo{
        position: absolute;
        right: pxToRem(35px);
        bottom: pxToRem(45px);
        z-index: 100;
        color: #ffffff;
        border-radius: 28px;
        font-size: 16px;
        height:28px ;
        line-height: 28px;
        width: 70px;
        text-align: center;
        border:1px solid #ffffff;
      }
    }
  }
  .shop-card-item.unactive {
    position: relative;
    &:before {
    content: "";
    background-image: url("../../../../static/img/my/invalid-icon.png");
    background-size: 100%;
    background-repeat: no-repeat;
    display: block;
    position: absolute;
    width: pxToRem(236px);
    height: pxToRem(217px);
    z-index: 3;
    right: pxToRem(20px);
    top: 60%;
    transform: translateY(-50%);
  }
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
    top: 0;
    left: 0;
  }
  }
</style>

