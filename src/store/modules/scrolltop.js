const state = {
  top:0
}

const mutations = {
   saveScrollTops(state,nums){
       state.top=parseInt(nums);
    }
}

export default {
   state,
   mutations
}