

const state = {
    isShow:false
 }
 
 const mutations = {
     setNewAddressPop(state,status){
         state.isShow=status;
      }
 }
 
 export default {
     state,
     mutations
 }