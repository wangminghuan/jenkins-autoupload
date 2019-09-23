const state = {
  detailData:{
    goods: {},
    goods_coupon: [],
    goods_sku: [],
    goods_spec: [],
    imgArr:[],
    initSpecName:[]
  },
  isShowSpecPop:false
}

const mutations = {
   setDetailData(state,obj){
     //分为 更新全部信息 ，重置数据和只更新产品规格
     if(obj.type==1){
      state.detailData=obj.data;
     }else if(obj.type==3){
       //重置数据
      state.detailData={
        goods: {},
        goods_coupon: [],
        goods_sku: [],
        goods_spec: [],
        imgArr:[],
        initSpecName:[]
      };
     }else{
      state.detailData.initSpecName=obj.data;
     }
    },
    //是否弹起规则弹窗
    setSpecPopStatus(state,status){
      state.isShowSpecPop=status;
    }
}
const actions={
  syncSetDetailData (context) {
    context.commit('setDetailData')
  }
}

export default {
   state,
   mutations,
   actions
}