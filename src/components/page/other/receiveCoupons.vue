<!-- 领取优惠券 -->
<template>
    <div class="receive-coupons-warp">
        <div class="coupons-box">
            <div class="coupons-box-show">
                <div class="coupon-item">
                    <section class="top">
                        <div class="lf">
                            <h3>{{couponsObj.cn_name}}</h3>
                            <h6 v-if="1">商城购物满{{couponsObj.cn_limitNum}}元可用</h6>
                        </div>
                        <p class="rt">
                            <span>￥</span>
                            <em>{{couponsObj.cn_faceValue}}</em>
                        </p>
                    </section>
                    <section class="btm" v-if="1">
                        <span>有效期：{{couponsObj.cn_startTime+'-'+couponsObj.cn_endTime}}</span>
                    </section>
                </div>
            </div>
            <div class="receive-box" @click="handleClick">
        </div>
        </div>
        <div class="receive-success" v-if="isReceiveClick" @click="isReceiveClick=false">
            <div :class="['receive-success-box',reStatus==2?'repeat':reStatus==1?'over':'success']"></div>
        </div>
        <span class="explain">本活动解释权归极夫特商城所有</span>
    </div>
</template>
<script>
import couponItem from "../my/couponItem";
export default {
    data() {
        return {
            cid:this.$route.query.cid,
            couponsObj:{},
            isReceiveClick:false,
            reStatus:1,
        }
    },
    methods: {
        getCoupons() {
            this.$axios.post("/wap/Coupon/couponDetail", {
                cn_id: this.cid
            })
                .then((res) => {
                    const _data = res.data;
                    this.$store.commit("setLoading", false);
                    if (_data.code == 0) {
                        this.couponsObj = _data.data;
                        this.couponsObj.cn_startTime = this.couponsObj.cn_startTime.substring(0, 10).split('-').join('.');
                        this.couponsObj.cn_endTime = this.couponsObj.cn_endTime.substring(0, 10).split('-').join('.');
                    }
                })
        },
        handleClick() {
            this.$store.commit("setLoading", true);
            this.$axios.post("/wap/Coupon/get", {
                cn_id: this.cid
            })
                .then((res) => {
                    const _data = res.data;
                    this.$store.commit("setLoading", false);
                    if(_data.code==0){
                        // 0、领取成功
                        // 1、您来晚了，优惠券已领完！
                        // 2、您已领取过该优惠券！
                        // 4、优惠券已过期
                        // 5,该优惠券已结束领取！
                        this.reStatus=_data.data.code;
                        if(this.reStatus==4||this.reStatus==5){
                            this.$toast.error(_data.message)
                            return;
                        }

                        this.isReceiveClick=true;
                    }
                    // 3、领取失败 code==1
                    
                })
        },
    },
    created() {
        // console.log()
        this.getCoupons()

    },
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.receive-coupons-warp {
    height: 100%;
    background: #2f0b51;
    
   img{
       display: block;
   }
   .coupons-box{
       position: relative;
       background-image: url("../../../../static/img/other/re_bg.jpg");
       background-size: 100% auto;
       background-repeat: no-repeat;
        width: pxToRem(750px);
        height: pxToRem(1127px);
       .coupons-box-show{
           position: absolute;
           width: pxToRem(500px);
           height: pxToRem(226px);
           top: 50%;
           left: 0;
           right: 0;
           margin:0 auto;
           transform: translateY(-80%);
           .coupon-item {
                height: pxToRem(232px);
                width: 100%;
                position: relative;
                background-color: #fff;
                margin: 0 auto;
                border-left: 1px solid #f5f5f5;
                border-right: 1px solid #f5f5f5;
                margin-bottom: pxToRem(32px);
                background-image: url("../../../../static/img/my/coupon.png");
                background-size: pxToRem(255px) auto;
                background-repeat: no-repeat;
                background-position-x: pxToRem(468px);
                background-position-y: pxToRem(30px);
                padding: 0 pxToRem(20px) 0 pxToRem(40px);
                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: pxToRem(144px);
                    color: #dd2727;
                    text-overflow: ellipsis;
                    .lf {
                        flex-shrink: 1;
                        overflow: hidden;
                        white-space: nowrap;
                        h3 {
                            font-size: 18px;
                            line-height: pxToRem(54px);
                            height: pxToRem(54px);
                        }
                        h6 {
                            font-size: 12px;
                            line-height: pxToRem(40px);
                            max-width: 3rem;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                    .rt {
                        position: absolute;
                        right: .2rem;
                        bottom:.6rem;
                        flex-shrink: 0;
                        margin-top: pxToRem(130px);
                        z-index: 1;
                        span {
                            font-size: 16px;
                        }
                        em {
                            font-size: 36px;
                        }
                    }
                }
                .btm {
                    position: absolute;
                    bottom: pxToRem(20px);
                    width: pxToRem(626px);
                    font-size: 10px;
                    color: #959595;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    span {
                        flex-shrink: 1;
                        white-space: nowrap; //   width: pxToRem(400px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    em {
                        flex-shrink: 0;
                        padding: 0 pxToRem(40px);
                        height: 32px;
                        line-height: 32px;
                        font-size: 14px;
                        color: #fff;
                        font-weight: 700;
                        border-radius: pxToRem(65px);
                        background: #dd2727;
                    }
                }
                &::before {
                    content: "";
                    background-image: url("../../../../static/img/my/border-top.png");
                    background-size: 10px auto;
                    background-repeat: repeat-x;
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 4px;
                    left: 0;
                    right: 0;
                    top: -2px;
                }
                &::after {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 4px;
                    left: 0;
                    right: 0;
                    bottom: -4px;
                    background-color: #dd2727;
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
       
            &::after{
                position: absolute;
                content: "";
                background-image: url("../../../../static/img/other/cou-icon.png");
                background-repeat: no-repeat;
                background-size: 100%;
                display: block;
                position: absolute;
                width: pxToRem(172px);
                height: pxToRem(200px);
                right: 0;
                bottom: pxToRem(-8px);
            }
       }
       img{
           width: 100%;
       }
   }
   .receive-box{
       position:absolute ;
       left:0;
       right: 0;
       width: pxToRem(340px);
       margin:0 auto;
       top:58%;
       height: pxToRem(120px);
       
   }
   .receive-success{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,.5);
        
        .receive-success-box{
            position: fixed;
            top: 50%;
            left: 50%;
            margin-left: pxToRem(40px);
            transform: translate(-50%,-50%);
            width: 7.46667rem;
            height: 7rem;
            background-repeat: no-repeat;
            background-size: 100%;
        }
        .success{
          background-image: url(../../../../static/img/other/success-icon.png);
        }
        .repeat{
            background-image: url(../../../../static/img/other/repeat-icon.png);
        }
        .over{
            background-image: url(../../../../static/img/other/over-icon.png);
        }
    }
    .explain{
        color: #744d99;
        display: block;
        text-align: center;
        line-height: pxToRem(82px);
    }
}
</style>

