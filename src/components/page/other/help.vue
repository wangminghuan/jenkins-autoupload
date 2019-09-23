<!-- 列表页面和搜索结构可公用的商品单元组件 -->
<template>
    <div class="help-warp">
        <div class="help-box" v-if="id==1">
            <h4>发货时间</h4>
            <p>正常情况下，订单支付成功后24小时左右为您安排发货，定制类及特殊商品请咨询客服后确认对应的发货时间，如遇大促活动或者缺货商品可能存在延时发货情况，请耐心等候。详细发货时间可以参考商品详情页的说明。</p>
        </div>
        <div class="help-box" v-if="id==2">
            <h4>快递及配送</h4>
            <p>不支持指定快递发货，包邮商品会为您随机指定普通快递进行配送。如有特殊需求请联系客服进行妥善解决。已发货商品我的订单中可查询到对应的发货快递公司及快递单号，请根据快递单号关注物流进度，如有任何疑问可以联系对应物流公司客服电话或者咨询在线客服。</p>
        </div>
        <div class="help-box" v-if="id==3">
            <h4>优惠券与购物卡</h4>
            <p>优惠券与购物卡只能在购买极夫特商城中的商品进行抵用。每张优惠券会有不同的使用规则及使用商品范围。优惠券一经使用无论订单是否取消或发生退换货均不支持退还。购物卡无抵扣及使用限制且订单取消或退货时会自动还原到您的账户。</p>
        </div>
        <div class="help-box" v-if="id==4">
            <h4>商品错发漏发</h4>
            <p>如发现收货时的商品出现错发、漏发等情况，请第一时间拍下收到的包裹外箱、快递单面、包裹内部详情并联系客服，客服一定会尽快帮您妥善处理。</p>
        </div>
        <div class="help-box" v-if="id==5">
            <h4>商品退换货</h4>
            <p>如有退换货需求请联系在线客服，在线客服会在24小时内处理，按照在线客服要求将商品寄回指定地点。在不影响二次销售的情况下支持7天无理由退换货（定制及部分商品不支持）。个人原因需顾客自己承担寄回快递费用，质量问题由商城承担。请选择普通快递先行垫付，退回运费我们承担8-12元，如有特殊原因超过12元请联系客服确认。收到商品后客服会联系您进行返还运费操作。</p>
        </div>
        <div class="help-box" v-if="id==6">
            <h4>注销账户</h4>
            <p>注销账户请联系在线客服。</p>
        </div>
        
       
    </div>
</template>
<script>
export default {
    data(){
        return {
            id:this.$route.query.id,
            hasClick:false
        }
    },
    methods:{
        
    },
    created() {
        this.$store.commit('setLoading', false)
    },
}
</script>

<style lang="scss">
@import "static/css/mixin.scss";
    .help-warp{
        padding: pxToRem(24px) 0;
        .help-box{
            background: #fff;
            padding: 0 pxToRem(30px) pxToRem(30px);
            h4{
                font-size: 16px;
                // font-weight: 700;
                // padding-bottom:pxToRem(50px);
                line-height: pxToRem(90px);
                border-bottom: 1px solid #f5f5f5;
            }
            p{
                // margin-bottom: pxToRem(24px);
                padding-top: pxToRem(24px);
                font-size: 14px;
                color: #959595;
                line-height: pxToRem(42px);
            }
            
        }
        
    }
</style>

