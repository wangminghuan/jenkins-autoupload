   <!-- 购物卡详情 -->
<template>
 <div class="my-card-details-wrap">
    <div class="bill" @click="jumpGoods()">
      <div class="left">账单</div>
      <div class="right arrow-icon"></div>
    </div>
    <div class="card">
      <div class="card-box">
        <div class="left">储蓄卡</div>
        <div class="right">有效期：{{fixTime(list.cd_startTime)+'-'+fixTime(list.cd_endTime)}}</div>
      </div>
      <div class="card-box">
        <div class="left">编号</div>
        <div class="right">No. {{list.cdu_sn}}</div>
      </div>
    </div>
    <div class="details">
      <h4>使用说明</h4>
      <div class="details-box"><section>{{list.cd_note}}</section></div>
      <!-- <div class="details-box">
        <h5>1.什么是购物卡</h5>
        <p>礼品商城购物卡由极夫特电子商务有限公司发行，可以并仅限在礼品商城上购买全类商品。</p>
      </div>
      <div class="details-box">
        <h5>2.购物卡的使用规则</h5>
        <p>礼品商城购物卡由极夫特电子商务有限公司发行，可以并仅限在礼品商城上购买全类商品</p>
      </div>
      <div class="details-box">
        <h5>3.购物卡权益</h5>
        <p>礼品商城购物卡由极夫特电子商务有限公司发行，可以并仅限在礼品商城上购买全类商品</p>
      </div> -->
    </div>
 </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      list: {
        cd_startTime:'',
        cd_endTime:''
      }
    };
  },
  methods: {
    fixTime(time){
        //将 2018-07-26 11:11:55 修正为 20180726
        const _time=typeof time=="string"?time:"0-0-0"
        let timeArr=_time.split(" ");
        let timeDate=timeArr[0]?timeArr[0]:"";
        return timeDate.split("-").join("")
       },
    getList() {
        this.$axios.post("/wap/Card/myCardDetail",{
          cdu_id:this.id
        })
        .then((res)=>{
          const _data=res.data;
          if(_data.code==0){
              this.list=_data.data;
          }
          this.$store.commit("setLoading", false);
        })
    },
    jumpGoods(id) {
      this.$router.push({
        path: "/index/my_shop_cardbill_details",
        query: { id: this.id }
      });
    }
  },
  created() {
    this.getList();
    // console.log(this.$route.query.id)
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-card-details-wrap {
  padding-top: pxToRem(32px);
  .bill {
    display: flex;
    justify-content: space-between;
    padding: 0 pxToRem(24px);
    line-height: pxToRem(90px);
    font-size: 15px;
    background: #fff;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: pxToRem(20px);
    .right {
      width: 50px;
      position: relative;
    }
    .arrow-icon::after {
      right: 0;
    }
  }
  .card {
    background: #fff;
    padding: 0 pxToRem(24px);
    margin-bottom: pxToRem(20px);
    .card-box {
      display: flex;
      justify-content: space-between;
      line-height: pxToRem(90px);
      font-size: 15px;
      border-bottom: 1px solid #f5f5f5;
      .right {
        color: #959595;
      }
    }
  }
  .details {
    background: #fff;
    padding-bottom: 10px;
    h4,
    .details-box {
      margin: 0 pxToRem(24px);
    }
    h4 {
      line-height: pxToRem(90px);
      font-size: 15px;
      border-bottom: 1px solid #f5f5f5;
    }
    .details-box {
      h5 {
        font-size: 15px;
        line-height: pxToRem(55px);
        padding-top: pxToRem(10px);
      }
      p {
        font-size: 13px;
        line-height: pxToRem(40px);
        color: #959595;
      }
      section{
        line-height: 28px
      }
    }
  }
}
</style>

