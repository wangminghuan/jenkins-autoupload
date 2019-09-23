const state = {
  isShowDialog:false
}

const mutations = {
   setCommentDialogStatus(state,status){
       state.isShowDialog=status;
    }
}

export default {
   state,
   mutations
}