//提交订单页和选择地址组件之间的数据传递
const state = {
    location:{
        a_id:"",
        address:"",
        name:"",
        phone:""
    }
 }
 
 const mutations = {
     setAddress(state,status){
         state.location=status;
      }
 }
 
 export default {
     state,
     mutations
 }