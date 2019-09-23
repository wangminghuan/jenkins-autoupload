const state = {
    active:""
 }
 
 const mutations = {
     setMenuActive(state,status){
         state.active=status;
      }
 }
 
 export default {
     state,
     mutations
 }