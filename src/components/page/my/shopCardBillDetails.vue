   <!-- 购物卡账单详情 -->
<template>
 <div class="my-card-bill-wrap">
    <yd-infinitescroll :callback="loadList" distance="100" ref="infinitescrollDemo">
      <section theme="1" slot="list">
          <div class="bill-box" v-for="(item,index) in list" :key="index">
            <div :class="['left',item && item.type==1?'out':'come']"></div>
            <div class="center">
              <h4>{{item.g_name}}</h4>
              <span>{{item.cur_createTime}}</span>
            </div>
            <div class="right">
              <span>{{(item && item.type==1?'-':'+')+item.cur_amount}}</span>
            </div>
          </div>
          </section>
          <!-- 加载完毕显示内容 -->
       <span slot="doneTip">{{$tips}}</span>
    </yd-infinitescroll>
     <li v-if="isDefault">
           <img class="default" src="../../../../static/img/my/no-card.png" alt="">
     </li>
 </div>
</template>
<script>
import Vue from "vue";
import { InfiniteScroll } from "vue-ydui/dist/lib.px/infinitescroll";
Vue.component(InfiniteScroll.name, InfiniteScroll);
export default {
  data() {
    return {
      id: this.$route.query.id,
      list: [],
      page: 1,
      pageSize: 10,
      isDefault: false
    };
  },
  methods: {
    getList() {
      this.$axios
        .post("/wap/Card/myCardUsedRecord", {
          cdu_id: this.id,
          page: this.page,
          pageSize:this.pageSize
        })
        .then(res => {
          this.$store.commit("setLoading", false);
          /* 单次请求数据完毕 */
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.finishLoad");
          const _data = res.data;
          if(_data.code==0){
            if (_data.length < 1 && this.page == 1) { //第一次请求并且长度为0
              this.isDefault = true;
              return;
            }
            let __data = _data.data instanceof Array ? _data.data : [];
            this.list=this.list.concat(__data);
            // __data.map(e => {this.list.push(e);});  //循环将数据加到列表中
            if (__data.length < this.pageSize&&this.page>1 ) {
                /* 所有数据加载完毕 显示下方无数据*/
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                return;
            }
          }
        });
    },
    loadList() {
      this.page++;
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-card-bill-wrap {
  padding-top: pxToRem(32px);
  .default {
    display: block;
    position: fixed;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  // .no-bill{
  //   display: block;
  //   position: fixed;
  //   width: 50%;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  //   text-align: center;
  //   color: #959595;
  // }
  .bill-box {
    padding: pxToRem(30px) pxToRem(24px);
    background: #fff;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    .left {
      margin-right: pxToRem(24px);
      width: pxToRem(70px);
      position: relative;
      @include backgroundImage(center, center, 35px, 35px);
    }
    .left.out {
      background-image: url("../../../../static/img/my/out-icon.png");
    }
    .left.come {
      background-image: url("../../../../static/img/my/come-icon.png");
    }
    .center {
      width: pxToRem(450px);
      h4 {
        line-height: pxToRem(40px);
        margin-bottom: pxToRem(10px);
        font-size: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      span {
        font-size: 12px;
        color: #959595;
      }
    }
    .right {
      position: relative;
      flex: 1;
      span {
        position: absolute;
        right: 0;
        top: 50%;
        font-size: 18px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>

