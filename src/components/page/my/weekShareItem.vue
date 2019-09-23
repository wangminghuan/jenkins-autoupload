<template>
  <!-- 每周分享卡片 -->

  <div :class="['week-share-card-wrap',$ios?'ios-wrap':'' ]">
    <div :class="[item.is_today==1?'today':item.is_today==2?'tomorrow':'week-'+item.week,'share-icon']"></div>
    <div class="lf"
         @click.stop="handleJump(0)">
      <img v-lazy="item.g_images">
    </div>
    <div class="rt"
         @click.stop="handleJump(0)">
      <section class="top">
        <h6 class="w-title">{{item.g_name}}</h6>
        <div class="w-mid">
          <span>￥<i>{{item.wsd_activity_price}}</i></span><b>￥{{item.sku_price}}</b><em class="w-time"
              v-if="type==2">{{millisecondToTime(leftTime)}}</em><em class="w-time disable"
              v-else-if="type==1">已结束</em><em class="w-time disable"
              v-else>未开始</em>
        </div>
        <!-- 已结束和正在抢购的展示 #feb157-->
        <div class="w-btm"
             v-if="item.is_today!=2 && (type==1 || type==2)">
          <yd-progressbar class="w-progress"
                          type="line"
                          :progress="item.progress_bar"
                          stroke-width="4"
                          trail-width="4"
                          trail-color="#feb157"
                          stroke-color="#fff"></yd-progressbar><em>已抢购{{item.progress_bar*100+"%"}}</em>
        </div>
      </section>
      <div class="w-btn"
           v-if="type==1||type==2">
        <div class="w-buy"
             @click.stop="handleJump(0)">立即购买</div>
        <div class="w-share"
             @click.stop="handleJump(1)">好物分享</div>
      </div>
      <!-- 未开始的展示 -->
      <section v-else>
        <div class="s-btn"
             v-if="item.is_today==2">
          <span v-if="leftTime<60*60">距离开始{{millisecondToTime(leftTime)}}</span>
          <span v-else>明日{{new Date(item.wsl_start_time.replace(/\-/g, "/")||'').getHours()}}点开抢</span>
        </div>
        <div class="s-btn"
             v-else>
          <span>{{(weekArr[parseInt(item.week)-1]?weekArr[parseInt(item.week)-1]:'')+(new Date(item.wsl_start_time.replace(/\-/g, "/")||'').getHours()+"点开抢")}}</span>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.px/progressbar';
Vue.component(ProgressBar.name, ProgressBar);
export default {
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      timer: null,
      // progress:0.5,
      // type:1, //1 ,2, 3 结束，正在抢购，未开始
      leftTime: 0,
      showTime: "",
      now: new Date(this.item.current_datetime.replace(/\-/g, "/")).getTime(),
      start: new Date(this.item.wsl_start_time.replace(/\-/g, "/")).getTime(),
      end: new Date(this.item.wsl_end_time.replace(/\-/g, "/")).getTime(),
      weekArr: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    }
  },
  computed: {
    type () {
      //1 ,2, 3 结束，正在抢购，未开始
      return this.start > this.now ? 3 : this.now > this.end ? 1 : 2
    },
  },
  methods: {
    millisecondToTime (msd) {
      var times = parseInt(msd);
      var day = 0, hour = 0, minute = 0, second = 0;//时间默认值
      if (times > 0) {
        hour = parseInt(times / (60 * 60)) - (day * 24);
        minute = parseInt(times / 60) - (day * 24 * 60) - (hour * 60);
        second = parseInt(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (day > 0 && day <= 9) day = '0' + day;
        if (hour > 0 && hour <= 9) hour = '0' + hour;
        if (minute > 0 && minute <= 9) minute = '0' + minute;
        if (second > 0 && second <= 9) second = '0' + second;
      }
      return (hour + "时" + minute + "分" + second + "秒");
    },
    handleJump (type) {
      if (type) {
        this.$router.push({ path: "/index/my_share_poster", query: { id: this.item.g_id } })
        if (typeof MtaH5 !== "undefined") MtaH5.clickStat("fx_button");
      } else {
        this.$router.push({ path: "/index/detail", query: { id: this.item.g_id } })

      }
      // this.$router.push(type?
      // {path:"/index/my_share_poster",query:{id:this.item.g_id}}
      // :{path:"/index/detail",query:{id:this.item.g_id}})
    }
  },
  destroyed () {
    clearInterval(this.timer);
  },
  created () {
    this.leftTime = (this.type == 2 ? parseInt(this.end - this.now) : this.type == 3 ? parseInt(this.start - this.now) : 0) / 1000;
    if (this.type === 2 || this.type === 3) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.leftTime <= 0) {
          window.location.reload();
        }
        this.leftTime--;
      }, 1000)
    }

  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";

.week-share-card-wrap {
  display: flex;
  background-color: #fff;
  padding: 12px pxToRem(30px) 25px pxToRem(20px);
  border-radius: 10px;
  justify-content: space-between;
  position: relative;
  .lf {
    width: pxToRem(238px);
    height: pxToRem(238px);
    flex-shrink: 0;
    margin-right: pxToRem(16px);
    position: relative;
    background-color: #f5f5f5;
    img {
      width: pxToRem(238px);
      @include imgCenter();
      max-height: pxToRem(238px);
    }
  }
  .rt {
    font-size: 12px;
    width: 62%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: pxToRem(238px);
  }
  .w-title {
    font-size: 13px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    // height: 32px;
    max-height: 32px;
  }
  .w-time {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #353535;
    &.disable {
      color: #959595;
    }
  }
  .w-mid {
    display: flex;
    height: 20px;
    // margin-top:6px;
    // margin-bottom:6px;
    font-size: 10px;
  }
  .w-btm {
    font-size: 10px;
    height: 14px;
    line-height: 14px;
    align-items: center;
    position: relative;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    .w-progress {
      width: 70%;
      height: 10px;
      box-sizing: border-box;
      border: 1px solid #f3b467;
      border-radius: 10px;
      position: relative;
      //  margin-top:2px;
      display: flex;
      overflow: hidden;
      align-items: center;
      transform: translateZ(0);
      svg {
        position: absolute;
        top: 0;
        // left:-0.5px;
        height: 8px;
        border-radius: 8px;
        transform: translateZ(0);
      }
    }
    em {
      color: #f3b467;
      font-size: 10px;
      margin-left: 3%;
      line-height: 14px;
      // position: absolute;
      // right: 0;
      // top:1px;
    }
  }
  .w-mid {
    display: flex;
    font-size: 10px;
    align-items: center;
    span {
      font-size: 12px;
      color: #dd2727;
    }
    i {
      font-size: 14px;
      color: #dd2727;
      font-weight: bold;
    }
    b {
      font-size: 10px;
      text-decoration: line-through;
      margin-left: pxToRem(15px);
      margin-right: pxToRem(15px);
      color: #959595;
    }
  }
  .top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: pxToRem(144px);
  }
  .w-btn {
    display: flex;
    justify-content: space-between;
    text-align: center;
    font-size: 12px;
    // margin-top:11px;
    .w-buy,
    .w-share {
      width: pxToRem(188px);
      height: 28px;
      line-height: 28px;
      border: 1px solid #fff;
      border-radius: 28px;
      box-sizing: border-box;
    }
    .w-buy {
      color: #dd2727;
      border-color: #dd2727;
    }
    .w-share {
      color: #fff;
      background-color: #dd2727;
    }
  }
  .s-btn {
    width: 100%;
    margin-top: 31px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #fff;
    border-radius: 28px;
    box-sizing: border-box;
    background-color: #959595;
    color: #fff;
    text-align: center;
    span {
      padding-left: 22px;
      background-image: url("../../../../static/img/my/time.png");
      background-size: 15px 15px;
      background-repeat: no-repeat;
      background-position: 0 pxToRem(12px);
      height: 28px;
      line-height: 28px;
      display: inline-block;
    }
  }
  .share-icon {
    position: absolute;
    left: pxToRem(-22px);
    top: -5px;
    width: pxToRem(233px);
    height: pxToRem(112px);
    z-index: 10;
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .today {
    background-image: url("../../../../static/img/my/week-today.png");
  }
  .tomorrow {
    background-image: url("../../../../static/img/my/week-tomorrow.png");
  }
  .week-1 {
    background-image: url("../../../../static/img/my/week-1.png");
  }
  .week-2 {
    background-image: url("../../../../static/img/my/week-2.png");
  }
  .week-3 {
    background-image: url("../../../../static/img/my/week-3.png");
  }
  .week-4 {
    background-image: url("../../../../static/img/my/week-4.png");
  }
  .week-5 {
    background-image: url("../../../../static/img/my/week-5.png");
  }
  .week-6 {
    background-image: url("../../../../static/img/my/week-6.png");
  }
  .week-7 {
    background-image: url("../../../../static/img/my/week-7.png");
  }
}
.week-share-card-wrap.ios-wrap {
  .w-title {
    font-size: 15px;
  }
  .w-mid {
    i {
      font-size: 15px;
    }
  }

  .w-btm {
    .w-progress {
      svg {
        height: 9px;
        border-radius: 7px;
      }
    }
  }
}
</style>

