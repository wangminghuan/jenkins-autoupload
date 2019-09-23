   <!-- 订单状态 全部  待付款  待发货 待收货-->
<template>
 <div class="my-address-wrap">
    <!-- 订单状态 -->
      <ul class="navTab">
        <li :class="[isOrder=='-1'?'active':'']" @click="setOrderShow('-1')">全部</li>
        <li :class="[isOrder==0?'active':'']" @click="setOrderShow('0')">待付款</li>
        <li :class="[isOrder==1?'active':'']" @click="setOrderShow('1')">待发货</li>
        <li :class="[isOrder==2?'active':'']" @click="setOrderShow('2')">待收货</li>
      </ul>
      <section>
        <yd-infinitescroll :scroll-top="true" :callback="loadList" distance="100" ref="infinitescrollDemo">
          <div theme="1" slot="list" class="order-all-wrap">
            <orderListItem v-for="(item,index) in list " :key="index"
            :item="item"
            :jumpOrderDetail="jumpOrderDetail" 
            :handleJumpPayment="handleJumpPayment"
            :handleSure="(item)=>handleSure(item,index)"
            class="all-wrap-box"
            ></orderListItem>
          </div>
              <!-- 加载完毕显示内容 -->
          <span slot="doneTip" >{{$tips}}</span>
        </yd-infinitescroll>
        <div v-if="noBill"><span class="no-bill"></span></div>
      </section>
       <goTop></goTop>
 </div>
</template>
<script>
import Vue from "vue";
import { InfiniteScroll } from "vue-ydui/dist/lib.px/infinitescroll";
import goTop from　"../../common/goTop";
Vue.component(InfiniteScroll.name, InfiniteScroll);
import orderListItem from './orderListItem'
export default {
  components: {
    orderListItem,
    goTop
  },
  data() {
    return {
      isOrder:this.$route.query.tab,
      list: [],
      noBill:false,
      page:1,
      pagesize:10
    };
  },
  methods: {
    // 查看详情
     jumpOrderDetail(id) {
      this.$router.push({ path: "/index/order_detail" ,query:{id:id}});
    },
   // 去付款
    handleJumpPayment(item){
      window.location.href="/index/pay/?osn="+item.o_sn+"&n="+item.out_trade_no+"&p="+item.o_payAmount
      // this.$router.push({path:'/index/pay/',query:{
      //   osn: item.o_sn,
      //   n:item.out_trade_no,
      //   p: item.o_payAmount
      // }})
    },
    // 确认收货
    handleSure(item,index){
      this.$dialog('是否确认收货？确认后将打款给卖家！',()=>this.setSure(item.o_id,index))
    },
    setSure(id,index){
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Order/setReceipt", {
          o_id:id
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
            this.list[index].o_status=3;
            this.list[index].o_status_name="已完成";
            this.$toast.success('订单交易成功！')
          }
        });
    },
    //   跳转新建地址
    jumpNewAddress() {
        this.$router.push({path:'/index/my_new_address'})
    },
    // 展示第几个 1 全部 2 待付款 3 待发货 4 待收货
    setOrderShow(v){
      this.$store.commit("setLoading", true);
      this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit'); //将滚动加载底部显示字去掉
      this.isOrder=v;
      this.noBill=false;
      this.list=[];
      this.page=1;
      this.getOrderList(false)
    },
    getOrderList(flag) { //flag为true则认为是从其他页面进入，刷新数据
      this.$axios
        .post("/wap/Order/getList", {
          order_status: this.isOrder,
          page: flag?1:this.page,
          pagesize:this.pagesize
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          /* 单次请求数据完毕 */
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.finishLoad");
          const _data=res.data;
          if(_data.code==0){
              let obj = _data.data||{};
              if (obj.data.length < 1 && this.page == 1) { //第一次请求并且长度为0
                this.list=[];
                this.noBill = true;
                return;
              }
              let _arr = obj.data instanceof Array ? obj.data : [];
              this.list= flag? _arr:this.list.concat(_arr);
              if (_arr.length < this.pagesize&&this.page>1 ) {
                  /* 所有数据加载完毕 显示下方无数据*/
                  this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                  return;
              }
           }
        });
    },
    loadList() {
      this.page++;
      this.getOrderList(false);
    }
  },
  activated(){
     this.getOrderList(true)
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";

.my-address-wrap {
 
  .navTab{
    background: #fff;
    display: flex;
    align-items: center;
    li{
      width: 25%;
      text-align: center;
      line-height: pxToRem(88px);
      font-size: 14px;
      transition: border .5s;
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      &:after{
        position: absolute;
        background: #c5c5c5;
        content: '';
        width: 1px;
        height: 40%;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
     }
     &:last-child::after{
       display: none;
     }
    }
    .active{
      color: #dd2727;
      border-bottom: 1px solid #dd2727;
    }

  }
  .no-bill{
    display: block;
    position: fixed;
    width: pxToRem(374px);
    height: pxToRem(310px);
    background: url(../../../../static/img/order/no_order_icon.png) no-repeat;
    background-size: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #959595;
    &::after{
      content: '您暂时还没有相关的订单';
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
    }
  }
  .order-all-wrap {
    .all-wrap-box{
      margin-top: pxToRem(24px);
      .order-status,.order-operation{
        padding: 0 pxToRem(24px);
        background: #fff;
      }
    }
  }
}
</style>

