import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import phone from '../utils/author'
import type from "../utils/source";
import {
  scrollTop,
  setScrollTop,
  getScrollTop,
  getScrollview
} from "../utils/utils"
Vue.use(Router)
const _vm = new Vue();
//因为路由采用history模式，为了解决刷新问题，通后端约定，所有路由必须为 index/xxx形式，否则刷新不会返回前端需要的index.html
const router = new Router({
  mode: 'history',
  routes: [{
      path: '*',
      redirect: '/index/error'
    },
    {
      path: '/',
      redirect: '/index/home',
    },
    {
      path: '/index/home',
      component: resolve => require(['../components/common/wrap.vue'], resolve),
      children: [{
          path: '/',
          meta: {
            title: '商城首页'
          },
          component: resolve => require(['../components/page/home/index.vue'], resolve),
          children: [{
              path: '/',
              meta: {
                title: '商城首页'
              },
              component: resolve => require(['../components/page/home/home.vue'], resolve),
              beforeEnter: (to, from, next) => {
                if (from.path == "/index/detail") {
                  //从详情回退回来的页面浏览位置还原
                  setTimeout(() => {
                    let $to = store.state.scrolltop.top;
                    let $el = document.getElementById("homeView");
                    let $view = getScrollview($el);
                    scrollTop($view, 0, $to, 0);
                  }, 0)
                }
                next();
              }
            },
            {
              path: '/index/home_search',
              meta: {
                title: '搜索'
              },
              component: resolve => require(['../components/page/home/search.vue'], resolve),
            },
          ]
        },
        {
          path: '/index/classify',
          meta: {
            title: '全部分类'
          },
          component: resolve => require(['../components/page/classify/index.vue'], resolve),
        },
        {
          path: '/index/cart',
          meta: {
            title: '购物车'
          },
          component: resolve => require(['../components/page/cart/index.vue'], resolve),
        },
        {
          path: '/index/my',
          meta: {
            title: '我的'
          },
          component: resolve => require(['../components/page/my/index.vue'], resolve),
        }
      ]
    },
    // 详情路由，嵌套了评论页面和商品详情
    {
      path: '/index/detail',
      component: resolve => require(['../components/page/other/detailView.vue'], resolve),
      children: [{
        path: '/',
        meta: {
          title: '详情'
        },
        component: resolve => require(['../components/page/other/detail.vue'], resolve),
        beforeEnter: (to, from, next) => {
          //进入详情页前记录页面滚动条位置 全局守卫因为 vue-navigation 的引入会渲染多次导致某些情况下页面抖动，故将功能放在此处
          let _scroll = 0;
          if (from.path == "/index/home") {
            const $el = document.getElementById("homeView");
            _scroll = $el ? getScrollview($el).scrollTop : 0;
          } else if (from.path == "/index/list") {
            _scroll = getScrollTop() || 0;
          }
          store.commit('saveScrollTops', _scroll);
          next();
        }
        },
        {
          path: '/index/comment_list',
          meta: {
            title: '全部评论'
          },
          component: resolve => require(['../components/page/comment/list.vue'], resolve),
          }]
    },
    // {
    //   path: '/index/detail',
    //   meta: {
    //     title: '详情'
    //   },
    //   component: resolve => require(['../components/page/other/detail.vue'], resolve),
    //   beforeEnter: (to, from, next) => {
    //     //进入详情页前记录页面滚动条位置 全局守卫因为 vue-navigation 的引入会渲染多次导致某些情况下页面抖动，故将功能放在此处
    //     let _scroll = 0;
    //     if (from.path == "/index/home") {
    //       const $el = document.getElementById("homeView");
    //       _scroll = $el ? getScrollview($el).scrollTop : 0;
    //     } else if (from.path == "/index/list") {
    //       _scroll = getScrollTop() || 0;
    //     }
    //     store.commit('saveScrollTops', _scroll);
    //     next();
    //   }
    // },
    {
      path: '/index/order_confirm',
      meta: {
        title: '确认订单'
      },
      component: resolve => require(['../components/page/order/orderConfirm.vue'], resolve),
    },
    {
      path: '/index/pay/',
      meta: {
        title: '收银台'
      },
      component: resolve => require(['../components/page/order/orderChoosePay.vue'], resolve),
    },
    {
      path: '/index/order_pay_result',
      meta: {
        title: '支付状态'
      },
      component: resolve => require(['../components/page/order/orderPayResult.vue'], resolve),
    },
    {
      path: '/index/error',
      meta: {
        title: '404'
      },
      component: resolve => require(['../components/common/404.vue'], resolve),
    },
    {
      path: '/index/login',
      meta: {
        title: '账号登录'
      },
      component: resolve => require(['../components/common/login.vue'], resolve),
    },
    {
      path: '/index/autologin',
      meta: {
        title: '商城首页'
      },
      component: resolve => require(['../components/common/autologin.vue'], resolve),
    },
    {
      path: '/index/homeRule',
      meta: {
        title: '商城首页'
      },
      component: resolve => require(['../components/page/other/homeRule.vue'], resolve)
    },
    {
      path: '/index/list',
      meta: {
        title: '商品列表'
      },
      component: resolve => require(['../components/page/other/list.vue'], resolve),
      beforeEnter: (to, from, next) => {
        //从详情回退回来的页面浏览位置还原
        if (from.path == "/index/detail") {
          setTimeout(() => {
            setScrollTop(store.state.scrolltop.top)
          }, 0)
        }
        next();
      }
    },
    {
      path: '/index/order_detail',
      meta: {
        title: '订单详情'
      },
      component: resolve => require(['../components/page/order/orderDetail.vue'], resolve),
    },
    {
      path: '/index/order_status',
      meta: {
        title: '我的订单'
      },
      component: resolve => require(['../components/page/order/orderStatus.vue'], resolve),
    },

    {
      path: '/index/my_new_address',
      meta: {
        title: '编辑收货地址'
      },
      component: resolve => require(['../components/page/my/newAddress.vue'], resolve),
    },
    {
      path: '/index/my_userinfo',
      meta: {
        title: '个人信息'
      },
      component: resolve => require(['../components/page/my/userInfo.vue'], resolve),
    },
    {
      path: '/index/my_infoSet',
      meta: {
        title: '个人信息'
      },
      component: resolve => require(['../components/page/my/infoSet.vue'], resolve),
    },
    {
      path: '/index/my_address',
      meta: {
        title: '地址管理'
      },
      component: resolve => require(['../components/page/my/address.vue'], resolve),
    },
    {
      path: '/index/my_coupon',
      meta: {
        title: '我的优惠券'
      },
      component: resolve => require(['../components/page/my/coupon.vue'], resolve),
    },
    {
      path: '/index/my_shop_card',
      meta: {
        title: '我的购物卡'
      },
      component: resolve => require(['../components/page/my/shopCard.vue'], resolve),
    },
    {
      path: '/index/my_shop_card_details',
      meta: {
        title: '购物卡详情'
      },
      component: resolve => require(['../components/page/my/shopCardDetails.vue'], resolve),
    },
    {
      path: '/index/my_shop_cardbill_details',
      meta: {
        title: '购物卡详情'
      },
      component: resolve => require(['../components/page/my/shopCardBillDetails.vue'], resolve),
    },
    {
      path: '/index/my_customer_help',
      meta: {
        title: '帮助与客服'
      },
      component: resolve => require(['../components/page/my/customerHelp.vue'], resolve),
    },
    {
      path: '/index/my_week_share',
      meta: {
        title: '每周分享'
      },
      component: resolve => require(['../components/page/my/weekShare.vue'], resolve),
    },
    {
      path: '/index/my_share_poster',
      meta: {
        title: '分享'
      },
      component: resolve => require(['../components/page/my/sharePoster.vue'], resolve),
    },
    // 服务商相关  
    {
      path: '/index/store_home',
      meta: {
        title: '店铺首页'
      },
      component: resolve => require(['../components/page/store/index.vue'], resolve),
    },
    {
      path: '/index/receive_coupons',
      meta: {
        title: '领取优惠券'
      },
      component: resolve => require(['../components/page/other/receiveCoupons.vue'], resolve),
    },

    {
      path: '/index/activity',
      meta: {
        title: '活动'
      },
      component: resolve => require(['../components/page/other/activity.vue'], resolve),
    },
    {
      path: '/index/help',
      meta: {
        title: '常见问题'
      },
      component: resolve => require(['../components/page/other/help.vue'], resolve),
    },
    {
      path: '/index/transfer',
      meta: {
        title: '转赠购物卡',
        UnWXAuthor:true,//不需要微信授权
      },
      component: resolve => require(['../components/page/other/transfer.vue'], resolve),
    },
    {
      path: '/index/im',
      meta: {
        title: '极夫特商城对话'
      },
      component: resolve => require(['../components/page/other/Im.vue'], resolve),
    },
    // 活动请以ban_activity开头
    {
      path: '/index/ban_activity_moon',
      meta: {
        title: '礼品卡兑换'
      },
      component: resolve => require(['../components/page/banActivity/moon/index.vue'], resolve),
    },
    // 活动请以ban_activity开头
    {
      path: '/index/ban_activity_invite',
      meta: {
        title: '兑换码'
      },
      component: resolve => require(['../components/page/banActivity/invite/index.vue'], resolve),
    },
    // 评论相关
    // {
    //   path: '/index/comment_list',
    //   meta: {
    //     title: '全部评论'
    //   },
    //   component: resolve => require(['../components/page/comment/list.vue'], resolve),
    // },
    {
      path: '/index/comment_creat',
      meta: {
        title: '我要评价'
      },
      component: resolve => require(['../components/page/comment/creat.vue'], resolve),
    },
    {
      path: '/index/comment_detail',
      meta: {
        title: '评价详情'
      },
      component: resolve => require(['../components/page/comment/detail.vue'], resolve),
    }
  ]
})
router.beforeEach((to, from, next) => {
  //将微信openid存起来
  if (to.query && to.query.openid) {
    sessionStorage.setItem("__openid__", to.query.openid)
  }
  //将每周分享的shareid存起来
  if(to.query && to.query.share_uid){
    sessionStorage.setItem("__shareid__", to.query.share_uid)
  }
  if (to.path !== from.path) store.commit('setLoading', true);
  store.commit('setMenuActive', to.path);
  // //判断是否需要跳转授权页面 (活动页不展示)
  if ((type === 1 || type === 2) && (to.path != "/index/autologin") && !(sessionStorage.getItem("__has_authorized_" + phone + "__"))) {
    next({
      path: "/index/autologin?redir=" + encodeURIComponent(to.fullPath)
    })
  }
  //没有获取到微信授权且在微信中打开(线下环境不跳转 UnWXAuthor为true也不跳转)
  if (type === 4 && (!sessionStorage.getItem("__openid__")) && window.location.port=="" && !to.meta.UnWXAuthor) {
    const redirectUrl = "https://m.newgiftmall.com" + to.fullPath;
    window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa02b1ab79d8b8cd6&redirect_uri=https%3a%2f%2fm.newgiftmall.com%2fwap%2fWxChat%2fgetUserInfo&response_type=code&scope=snsapi_base&state=" + encodeURIComponent(redirectUrl) + "#wechat_redirect")
  }
  _vm.$navigation.once('replace', (to, from) => {
    store.commit('setLoading', false);
  })
  next()
})
router.afterEach((to, from) => {
  //判断是否有标题
  let _title = to.query.atitle ? decodeURIComponent(to.query.atitle) : to.meta.title;
  _title && _vm.$setTitle(_title);
  _vm.$navigation.once('back', (to, from) => {
    store.commit('setLoading', false);
  })
});
export default router;
