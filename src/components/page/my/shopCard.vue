   <!-- 我的购物卡 -->
<template>
 <div class="my-card-wrap">
     <ul theme="1" slot="list">
         <shop-cart-item v-for="(item,index) in list" :key="index" :item="item" :handleClick="jumpGoods"></shop-cart-item>
         <li v-if="isDefault" class="no-card">
           <img src="../../../../static/img/my/no-card.png" alt="">
           <p>暂无购物卡</p>
         </li>
     </ul>
     <goTop></goTop>
 </div>
</template>
<script>
import Vue from "vue";
import goTop from　"../../common/goTop";
import shopCartItem from "./shopCartItem";
export default {
  components:{
    shopCartItem,
    goTop
  },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      isDefault: false
    };
  },
  methods: {
    getList() {
        this.$axios.post("/wap/Card/myCardList",{
          page: this.page,
          pageSize:this.pageSize
        })
        .then((res)=>{
          this.$store.commit("setLoading", false);
          const _data=res.data;
          if(_data.code==0){
              if(res.data.data.length<1&&this.page==1){
                this.isDefault=true;
              }
              let __data=_data.data instanceof Array?_data.data:[];
              this.list=(__data);
          }
        })
    },
    jumpGoods(item) {
      this.$router.push({ path: "/index/my_shop_card_details" ,query:{id:item.cdu_id}});
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-card-wrap {
  padding-top: pxToRem(32px);
  .no-card{
    // display: block;
    width: 50%;
    @include fixedCenter();
    p{
      @include tips();
    }
  }
}
</style>

