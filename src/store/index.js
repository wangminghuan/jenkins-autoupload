import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import menu from './modules/menu'
import cart from './modules/cart'
import address from './modules/address'
import gotop from './modules/gotop'
import adpop from './modules/adpop'
import scrolltop from './modules/scrolltop'
// import comments from "./modules/comment"
import detail from "./modules/detail";
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    modules: {
        loading,
        menu,
        cart,
        address,
        gotop,
        adpop,
        scrolltop,
        detail
        // comments
    },
    strict: debug,
})