const state = {
    nums:0
 }
 
 const mutations = {
     setCartNums(state,status){
         state.nums=parseInt(status);
      }
 }
 
 export default {
     state,
     mutations
 }