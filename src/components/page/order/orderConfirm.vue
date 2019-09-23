    <!-- 订单确认页面-->
<template>
    <div class="order-confirm-wrap common-scroll-wrap">
        <!-- 订单头部 -->
        <div class="common-scroll-view">
        <section class="order-hand-wrap" @click="jumpAddress">
            <h2><span>{{typeof location.name=="string" && location.name.length>3?location.name.substring(0,3)+'...':location.name}}</span><em>{{location.phone}}</em><i v-show="location.address &&addressDefaultId==location.a_id">默认</i></h2>
            <p>{{location.address}}</p>
        </section>

        <!-- 订单列表 极夫特商城-->
        <section class="order-list-wrap" v-if="renderData.gift && renderData.gift.length>0">
            <div class="order-shop-title">
                <span class="gift-title-icon title-icon">极夫特商城</span>
            </div>
            <div v-for="(item,index) in renderData.gift" :key="index">
            <div class="order-list-li" v-for="(items,indexs) in item" :key="indexs">
                <section class="order-pic-top">
                   <div class="pic-wrap"><img v-lazy="items.g_images" class="order-pic"></div>
                    <div class="order-right-box">
                        <div class="order-title" :data="items.g_freightAmount">{{items.g_name}}</div>
                        <!-- <span class="order-rule"><b v-for="(g,i) in items.sku_info" :key="i">{{g.spec+": "+g.spec_value}}</b></span> hjp修改 -->
                        <span class="order-rule">规格：<b v-for="(g,i) in items.sku_info" :key="i">{{g.spec_value}},</b></span>
                        <div class="order-price">
                            <span>{{'￥'+items.ct_price}}</span>
                            <i>{{"x"+items.ct_num}}</i>
                        </div>
                    </div>
                </section>
                <section class="order-distributi">
                    <div class="order-between">
                        <em>配送方式</em>
                        <span :data="items.g_freightAmount"><b>快递 </b><i>{{'￥'+items.g_freightAmount}}</i></span>
                    </div>
                </section>
                <section class="order-distributi">
                    <div class="order-between">
                        <em>配送说明</em>
                        <span>{{items.freight_note}}</span>
                    </div>
                </section>
                
            </div>
            <section class="order-distributi order-note">
                    <div class="order-between">
                        <em>备注</em>
                        <input class="order-instruction" placeholder="对本次交易的说明" v-model="message[index]">
                    </div>
                </section>
            </div>
        </section>
        <!-- 订单列表 其他商家-->
        <section class="order-list-wrap" v-if="renderData.merchant && renderData.merchant.length>0">
            
            <div v-for="(item,index) in renderData.merchant" :key="index">
            <div class="order-shop-title">
                   <span class="dian-title-icon title-icon">{{item[0].shop_name||"未命名店铺"}}</span>
            </div>
            <div class="order-list-li" v-for="(items,indexs) in item" :key="indexs">
                <section class="order-pic-top">
                    <div class="pic-wrap"><img v-lazy="items.g_images" class="order-pic"></div>
                    <div class="order-right-box">
                        <div class="order-title">{{items.g_name}}</div>
                        <!-- <span class="order-rule"><b v-for="(g,i) in items.sku_info" :key="i">{{g.spec+": "+g.spec_value}}</b></span> hjp修改 -->
                        <span class="order-rule">规格: <b v-for="(g,i) in items.sku_info" :key="i">{{g.spec_value}},</b></span>
                        <div class="order-price">
                            <span>{{'￥'+items.ct_price}}</span>
                            <i>{{"x"+items.ct_num}}</i>
                        </div>
                    </div>
                </section>
                <section class="order-distributi">
                    <div class="order-between">
                        <em>配送方式</em>
                        <span><b>快递 </b><i>{{'￥'+items.g_freightAmount}}</i></span>
                    </div>
                </section>
                <section class="order-distributi">
                    <div class="order-between">
                        <em>配送说明</em>
                        <span>{{items.freight_note}}</span>
                    </div>
                </section>
                
            </div>
            <section class="order-distributi order-note">
                    <div class="order-between">
                        <em>备注</em>
                        <input class="order-instruction" placeholder="对本次交易的说明" v-model="message[giftLens+index]">
                    </div>
                </section>
            </div>
        </section>
        <section class="order-info">
            <section class="order-distributi arrow-icon"><div class="order-between" @click="handleShowCouponPop"><em>优惠券</em><span style="padding-right:14px" v-html="couponTips"></span></div></section>
            <section class="order-distributi arrow-icon"><div class="order-between" @click="handleShowCardPop"><em>购物卡</em> <span style="padding-right:14px" v-html="cardTips"></span ></div></section>
            <ul class="info">
                <ol>支付信息</ol>
                <li><em>商品金额</em><span>{{"￥ "+(renderData.goodsTotalAmount||0)}}</span></li>
                <li><em>优惠</em><span>{{"-￥ "+(renderData.offerAmount||0)}}</span></li>
                <li><em>运费</em><span>{{"+￥ "+(renderData.freightAmount||0)}}</span></li>
            </ul>
        </section>
        </div>
        <!-- 订单底部 -->
        <section class="order-footer-wrap" v-if="isLoadOver">
            <span>实付款：</span>
            <span>{{"￥ "+(renderData.totalAmount||0)}}</span>
            <span @click="handleSubmit">提交订单</span>
        </section>
          <!-- 优惠券 -->
         <yd-popup v-model="showCouponPop" position="bottom" height="6.5rem;" class="pop-box coupon-box">
              <div class="title-name"><span>优惠券</span></div>
              <section v-if="renderData.couponList&&renderData.couponList.length>0" class="common-scroll-wrap">
                    <ul class="common-scroll-view">
                        <li @click="handleSelectdCard(index,1)" v-for="(item,index) in renderData.couponList" :key="index"><span>{{item.cnu_id!=-1?(item.cn_faceValue+"元优惠券"):"不使用优惠劵"}}</span><b :class="['common-checkbox-icon',{'checked':item.selected}]"><i></i></b></li>
                    </ul>
              </section>
               <div v-if="renderData.couponList&&renderData.couponList.length>0" class="btn"  @click.stop.prevent="handleConfirmPop(1)">确定</div>
              <ul v-else class="pop-default"><img src="../../../../static/img/my/no-coupon.png"><p>暂无优惠券</p></ul>
         </yd-popup>
         <yd-popup v-model="showCardPop" position="bottom" height="6.4rem" class="pop-box card-box">
              <div class="title-name"><span>购物卡</span></div>
              <section v-if="renderData.cardList&&renderData.cardList.length>0" class="common-scroll-wrap">
                    <ul class="common-scroll-view">
                        <li @click="handleSelectdCard(index,2)" v-for="(item,index) in renderData.cardList" :key="index"><span>{{item.cdu_id!=-1?(item.cdu_balance+"元购物卡"):"不使用购物卡"}}</span><b :class="['common-checkbox-icon',{'checked':item.selected}]"><i></i></b></li>
                    </ul>
              </section>
              <div v-if="renderData.cardList&&renderData.cardList.length>0" class="btn" @click="handleConfirmPop(2)">确定</div>
              <ul v-else class="pop-default"><img src="../../../../static/img/my/no-card.png"><p>暂无购物卡</p></ul>
         </yd-popup>
    </div>
</template>
<script>
import Vue from "vue";
import { Popup } from "vue-ydui/dist/lib.px/popup";
Vue.component(Popup.name, Popup);
export default {
  data() {
    return {
      isLoadOver:false,//是否加载完毕
      showCouponPop:false,
      showCardPop:false,
      cnu_id:"",//优惠券ID
      cdu_id:"",//购物卡id
      couponTips:"",
      cardTips:"",
      renderData:{},
      addressDefaultId: 0, //头部地址默认id,
      location:this.$store.state.address.location,
      renderData:{
            gift:[],
            merchant:[],
            cardList:[],
            couponList:[],
            address:{}
        },
        giftLens:0,
        merchantLens:0,
        message:[],
    }
    
  },
  methods: {
      //单选购物卡,优惠券。type:1优惠劵，2购物卡
       handleSelectdCard(_index,type){
        type==1?this.renderData.couponList.map((item,index)=>{
            item.selected=(index===_index)?1:0;
        }):this.renderData.cardList.map((item,index)=>{
            item.selected=(index===_index)?1:0;
        })
      },
     //   弹窗关闭 type:1优惠劵，2购物卡
      handleConfirmPop(type){
          const item=this.getSelectedList(type);
          if(type==1){
                const _id=item.cnu_id||"";
                if(_id!=""){
                    this.cnu_id=_id>-1?_id:"";
                    this.couponTips=_id>-1 ?"1张优惠劵":"不使用优惠券";
                    this.showCouponPop=false;
                }else{
                     this.showCouponPop=false;
                     return;
                }
          }else{
              const _id=item.cdu_id||"";
               if(_id!=""){
                    this.cdu_id=_id;
                    this.cardTips= _id>-1 ?(item.cdu_balance+"元购物卡"):"不使用购物卡"
                    this.showCardPop=false;
               }else{
                   this.showCardPop=false;
                    return;
               }
          }
          this.getRenderData("update")
      },
      getSelectedList(type){
          const arr=type==1?this.renderData.couponList:this.renderData.cardList;
            for(let i=0;i<arr.length;i++){
                if(arr[i].selected==1) return arr[i]
            }
           return {}
      },
      //点击展示购物卡
      handleShowCardPop(){
         if(!this.renderData.cardList || this.renderData.cardList.length<2) return;
          this.showCardPop=true;
      },
      //点击展示优惠券
      handleShowCouponPop(){
          if(!this.renderData.couponList || this.renderData.couponList.length<2) return;
          this.showCouponPop=true;
      },
      jumpAddress(){
        this.$router.push({path:"/index/my_address",query:{aid:this.location.a_id}})
      },
    //提交订单
    handleSubmit() {
      this.$store.commit('setLoading', true);
      this.$axios.post('/wap/Order/orderCreate',{
          message:this.message
      }).then(res => {
        const _data = res.data
        if (_data.code == 0) {
           if(_data.message=="购买成功"){
               this.$router.replace({
                path: '/index/order_pay_result',
                query: {status:1}
            })
            }else{
              window.location.replace("/index/pay/?n="+_data.data.data.out_trade_no+"&p="+_data.data.data.totalAmount);
                // this.$router.replace({
                //     path: '/index/pay/',
                //     query: {
                //     n: _data.data.data.out_trade_no,
                //     p: _data.data.data.totalAmount
                //     }
                // })
            }
            this.getCartNums();
        }else{
            //提交失败后，1s后返回购物车
            setTimeout(()=>{
                window.history.go(-1)
            },1000)
        }
        this.$store.commit('setLoading', false)
      })
    },
    //获取订单数据
    getRenderData(type) {
      this.$store.commit('setLoading', true)
      this.$axios
        .post('/wap/Order/orderConfirm', {
          ct_id: this.$route.query.tid,
          a_id: this.$store.state.address.location.a_id||"", //地址id
          cnu_id:this.cnu_id && this.cnu_id!=-1?this.cnu_id:'',//优惠券id
          cdu_id:this.cdu_id && this.cdu_id!=-1?this.cdu_id:'',//购物卡id
        })
        .then(res => {
          const _data = res.data
          if (_data.code == 0) {
              this.isLoadOver=true;
              //选取优惠券后，只更新优惠后的数据，其他不需要重新计算
              if(type=="update"){
                  this.renderData.goodsTotalAmount=_data.data.goodsTotalAmount
                  this.renderData.offerAmount=_data.data.offerAmount
                  this.renderData.totalAmount=_data.data.totalAmount
                  this.$store.commit('setLoading', false)
                  return;
              }
              //选取地址，只更新运费信息
              if(type=="address"){
                this.renderData.merchant=_data.data.merchant;
                this.renderData.gift=_data.data.gift;
                this.renderData.freightAmount=_data.data.freightAmount;
                this.renderData.goodsTotalAmount=_data.data.goodsTotalAmount
                this.renderData.offerAmount=_data.data.offerAmount
                this.renderData.totalAmount=_data.data.totalAmount
                 
                this.$store.commit('setLoading', false)
                return;
              }
              //购物卡数据处理
              if(_data.data.cardList){
                  _data.data.cardList.push({
                        cdu_balance:0,
                        cd_name:"不使用购物卡",
                        cdu_id:-1
                  })
                   _data.data.cardList.map((item)=>{
                      item.selected=0
                   })
                   
              }
              //优惠券数据处理
              if(_data.data.couponList){
                  _data.data.couponList.push({
                        cn_faceValue:0,
                        cn_name:"不使用优惠券",
                        cnu_id:-1
                  })
                   _data.data.couponList.map((item)=>{
                      item.selected=0
                   })
                   
              }
            this.renderData = _data.data;
            let couponListNum,cardListNum;
            if(this.renderData.couponList.length>0){ //获取优惠券张数
                couponListNum = this.renderData.couponList.length;
            };
            if(this.renderData.cardList.length>0){ //获取购物卡张数
                cardListNum = this.renderData.cardList.length;
            };
            this.addressDefaultId=this.renderData.address.a_id;//存储默认地址id
            this.couponTips=(!this.renderData.couponList || this.renderData.couponList.length<2)?"暂无优惠券":`<i class='def-tips'>您有${couponListNum-1}张优惠券可用</i>`;
            this.cardTips=(!this.renderData.cardList || this.renderData.cardList.length<2)? "暂无购物卡":`<i class='def-tips'>您有${cardListNum-1}张购物卡可用</i>`;
            this.giftLens=_data.data.gift && _data.data.gift instanceof Array? _data.data.gift.length:0;
            this.merchantLens=_data.data.merchant && _data.data.merchant instanceof Array? _data.data.merchant.length:0;
            this.$store.commit("setAddress",{
                a_id:this.renderData.address.a_id,
                address:this.renderData.address.address,
                name:this.renderData.address.name,
                phone:this.renderData.address.phone,
            })
            this.location=this.$store.state.address.location;
            //默认留言数量初始化
            let newArr=new Array(this.giftLens+this.merchantLens)
            for(let m=0;m<newArr.length;m++){
                newArr[m]=""
            }
            this.message=newArr;
          }else{
              //获取数据失败，2s后返回上一页
              setTimeout(()=>{
                 window.history.go(-1)
              },2000)
          } 
          this.$store.commit('setLoading', false)
        })
    },
  },
  //防止缓存
  activated(){
    this.location=this.$store.state.address.location;
    if(this.location.a_id) this.getRenderData("address")
  },
  created(){
      this.getRenderData() //数据拉取
  }
}
</script>

<style lang="scss">
@import 'static/css/mixin.scss';
@import 'static/css/variables.scss';
.order-confirm-wrap {
  width: 100%;
  .common-scroll-wrap{
     height: pxToRem(90*3px);
     margin-top:pxToRem(100px);
  }
  .pop-box{
     .yd-popup{
          .empty{
              line-height: pxToRem(110px);
              text-align: center;
              font-size: 16px;
              color:#b9b1b1
          }
         } 
      .title-name{
          text-align: center;
          position: relative;
          line-height: pxToRem(100px);
          height: pxToRem(100px);
          font-size: 14px;
          position: fixed;
          top:0;
          left: 0;
          right: 0;
          z-index: 9999;
          background-color: #fff;
      }
      li{
         display:flex;
         justify-content: space-between;
         align-items: center;
         height: pxToRem(90px);
         margin:0 pxToRem(30px);
         border-bottom: 1px solid #f5f5f5;
         box-sizing: border-box;
         span{
             font-size: 14px;
             color: #353535;
         }
         &:last-child{
             border-bottom: none;
         }
      }
      .btn{
        width: 100%;
        height:pxToRem(100px);
        line-height:pxToRem(100px);
        text-align: center;
        display: block;
        color: #fff;
        font-size: 14px; 
        background: #dd2727;
        transform: translateZ(0)
      }
  }
  .order-hand-wrap {
    width: 100%;
    padding:0 pxToRem(30px);
    // height: pxToRem(138px);
    // height: pxToRem(150px);
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        right: pxToRem(30px);
        top: pxToRem(55px);
        width: 10px;
        height: 10px;
        border-top: 2px solid #959595;
        border-right: 2px solid #959595;
        transform: rotate(45deg);
    }
    &:before{
        content: '';
        width:100%;
        height: 4px;
        position: absolute;
        left: 0;
        bottom: 0;
        background:url('../../../../static/img/order/shop_hand_icon.png');
        background-position: bottom;
        background-size:100% 4px;
    }
    h2 {
      padding-left: pxToRem(40px);
      color: #353535;
      font-size: 14px;
      display: flex;
      font-weight: 600;
      margin-top:pxToRem(30px);
      flex-wrap: nowrap;
      span{
          font-size: 15px;
          flex-shrink: 1;
          white-space: nowrap;
        //   max-width: pxToRem(148px);
          overflow: hidden;
          text-overflow: ellipsis;
      }
      em {
        margin-left: pxToRem(24px);
        font-weight: 600;
        flex-shrink: 1;
        white-space: nowrap;
        max-width: pxToRem(220px);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i {
        display: inline-block;
        margin-left: pxToRem(20px);
        font-size: 10px;
        background: #dd2727;
        border-radius: 4px;
        color: #ffffff;
        padding: 2px;
        flex-shrink: 0;
      }
      
    }
    p {
      margin-top: pxToRem(15px);
      padding-left: pxToRem(40px);
      padding-right: pxToRem(30px);
      background-size: 15px auto;
      background-repeat: no-repeat;
      background-image: url('../../../../static/img/order/adds-icon.png');
      font-size: 14px;
      color: #353535;
      line-height: 18px;
      margin-bottom: pxToRem(28px);;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    }
  }
  .order-list-wrap {
    width: 100%;
    .order-shop-title {
      height: pxToRem(88px);
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 pxToRem(30px);
      .title-icon{
        padding-left: pxToRem(40px);
        font-size: 16px;
        color:#353535;
        background-repeat: no-repeat;
        background-size:pxToRem(32px) pxToRem(32px);
        background-position: left center;
      }
      .dian-title-icon{
        background-image: url('../../../../static/img/order/shop_dia_icon.png');
      }
      .gift-title-icon{
        background-image: url('../../../../static/img/order/shop_gift_icon.png');
      }
    }
    .order-list-li{
        width:100%;
        background:#fff;
        .order-pic-top{
            width:100%;
            border-bottom:1px solid #f5f5f5;
            padding:pxToRem(24px) pxToRem(30px);
            box-sizing: border-box;
            display: flex;
            .pic-wrap{
                width:pxToRem(185px);
                height: pxToRem(185px);
                border: 1px solid #f5f5f5;
                border-radius: 4px;
                overflow: hidden;
                flex-shrink: 0;
                margin-right: pxToRem(25px);
                box-sizing: border-box;
                position: relative;
                background-color: $lazyBackColor;
            }
            .order-pic{
                @include imgCenter();
            }
            .order-right-box{
                width:100%;
                display: flex;
                flex-direction: column;
                position: relative;
                .order-title{
                    padding-top:3px;
                    color:#353535;
                    font-size:14px;
                    // height: pxToRem(70px);
                    line-height: pxToRem(40px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .order-rule{
                    font-size:12px;
                    color:#959595;
                    display: inline-block;
                    line-height: pxToRem(30px);
                    margin-top: pxToRem(15px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width:pxToRem(480px);
                    b{
                        margin-right: pxToRem(10px);;
                    }
                }
                .order-price{
                    position: absolute;
                    bottom:0;
                    font-size:14px;
                    color:#dd2727;
                    width:100%;
                    display: flex;
                    justify-content:space-between;
                }
            }
        }
    }
  }
  .order-distributi{
            width:100%;
            height: pxToRem(87px);
            display: flex;
            padding:0 pxToRem(30px);
            background-color: #fff;
            .order-between{
                display: flex;
                align-items: center;
                justify-content:space-between;
                width:100%;
                border-bottom:1px solid #f5f5f5;
                em{
                    color:#353535;
                    font-size:15px;
                }
                span{
                    font-size:15px;
                    color:#353535;
                    i{
                        color:#dd2727;
                    }
                    .def-tips{
                        color: #959595
                    }
                }
                .order-instruction{
                    // color:#959595;
                    text-align: right;
                }
            }
        }
.order-note{
    margin-bottom:pxToRem(24px);
    .order-between{
        border-bottom: none;
    }
}
  .order-info{
        background-color: #fff;
        // margin-top:pxToRem(24px);
        margin-bottom: pxToRem(120px);
        .info{
            padding:0 pxToRem(30px);
            font-size: 14px;
            ol{
                color: #959595;
                padding: pxToRem(20px) 0 pxToRem(30px) 0;
            }
            li{
                display: flex;
                color: #353535;
                align-items: center;
                justify-content: space-between;
            //   height: pxToRem(50px);
              height: pxToRem(50px);
              span{
                  color: #dd2727
              }
            }
        }
  }
  .order-footer-wrap{
    height: pxToRem(100px);
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: pxToRem(100px);
    box-sizing: border-box;
    border-top: 1px solid #f5f5f5;
    background-color: #fff;
    z-index: 1000;
    display: flex;
    padding-left: pxToRem(30px);
    align-items: center;
    justify-content:flex-end;
    span:nth-child(1){
        font-size: 14px;
        color:#353535;
    }
    span:nth-child(2){
        color:#dd2727;
        font-size: 16px;
        margin-right: pxToRem(25px);
    }
    span:nth-child(3){
        color:#fff;
        width: pxToRem(270px);
        height: pxToRem(100px);
        background: #dd2727;
        display:flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }
    // em{
    //     width: 100%;
    //     height: 100%;
    //     background-color: #dd2727;
    //     line-height:pxToRem(100px);
    //     text-align: center;
    //     display: block;
    //     color: #fff;
    //     font-size: 14px; 
    // }
  }
  .pop-default{
      img{
       width:50%;
       display:block;
       margin:100px auto 0 auto;
    }
    p{
       @include tips()
    }
  }
}
</style>

