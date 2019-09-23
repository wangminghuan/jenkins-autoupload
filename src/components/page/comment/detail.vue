<template>
 <!-- 用户评价 -->
  <div class="comment-detail-wrap">
    <comment-item :itemData="renderData" :type="2"></comment-item>
    <div class="tips">—— 没有更多了 ——</div>
  </div>
</template>
<script>
import commentItem from "./item"
export default {
  components:{
    commentItem
  },
  data(){
    return{
        renderData:{},
        id:this.$route.query.id||"",
    }
  },
  methods:{
    getData(){
      this.$axios.post("/wap/Judge/getGoodsJudgeDetail",{
        ogj_id:this.id,
      }).then((res)=>{
        const _data=res.data;
        if(_data.code==0){
          this.renderData=_data.data||{};
          console.log(this.renderData)
        }else{
          this.$toast.error(_data.message)
        }
        this.$store.commit("setLoading", false);
      })
    }
  },
  created(){
      this.getData();
  }
}
</script>
<style lang="scss">
 .comment-detail-wrap {

 .tips{
    font-size:12px;
    color:#CCCCCC;
    line-height:22px;
    padding-top:22px;
    padding-bottom:40px;
    text-align: center;
    }
 }
</style>

