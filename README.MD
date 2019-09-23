# 商城项目说明
### 安装依赖

	npm install 

### 项目运行

   	npm run dev

### 项目构建
   	npm run build

### 项目结构


	├─.babelrc
	├─.editorconfig
	├─.gitignore
	├─.postcssrc.js
	├─index.html
	├─package-lock.json
	├─package.json
	├─README.md
	├─result.txt
	├─static
	|   ├─.gitkeep
	|   ├─svg
	|   |  └rate.svg  //svg相关
	|   ├─img
	|   ├─css
	|   |  ├─mixin.scss
	|   |  ├─reset.scss
	|   |  └variables.scss
	├─src   
	|  ├─App.vue   //根组件
	|  ├─main.js   //入口文件
	|  ├─utils     
	|  |   ├─author.js  // 获取用户手机号，在app内
	|  |   ├─sign.js    // 签名函数
	|  |   ├─source.js  // 平台来源
	|  |   └utils.js    //工具集
	|  ├─test
	|  ├─store          //状态管理
	|  |   ├─index.js
	|  |   ├─modules
	|  |   |    ├─address.js
	|  |   |    ├─adpop.js
	|  |   |    ├─cart.js
	|  |   |    ├─comment.js
	|  |   |    ├─detail.js
	|  |   |    ├─gotop.js
	|  |   |    ├─loading.js
	|  |   |    ├─menu.js
	|  |   |    └scrolltop.js
	|  ├─router
	|  |   └index.js    //路由
	|  ├─http
	|  |  └http.js
	|  ├─components
	|  |     ├─page
	|  |     |  ├─store   //店铺相关
	|  |     |  |   ├─index.vue
	|  |     |  |   ├─storeBranch.vue
	|  |     |  |   └storeHome.vue
	|  |     |  ├─other         //其他类    
	|  |     |  |   ├─activity.vue    //店铺活动
	|  |     |  |   ├─detail.vue       //详情页
	|  |     |  |   ├─detailView.vue    //详情主入口（包括详情和评论）
	|  |     |  |   ├─help.vue         //帮助页面
	|  |     |  |   ├─homeRule.vue    //首页浮选落地页
	|  |     |  |   ├─Im.vue       //聊天入口 （已废弃）
	|  |     |  |   ├─item.vue   //列表和搜索公用的商品样式
	|  |     |  |   ├─list.vue   //商品列表
	|  |     |  |   ├─receiveCoupons.vue  //领取优惠券
	|  |     |  |   └transfer.vue    // 购物卡转赠
	|  |     |  ├─order               //订单相关
	|  |     |  |   ├─orderChoosePay.vue  //选择支付
	|  |     |  |   ├─orderConfirm.vue   //订单确认
	|  |     |  |   ├─orderDetail.vue     //订单详情
	|  |     |  |   ├─orderListItem.vue   
	|  |     |  |   ├─orderPayResult.vue  //订单结果
	|  |     |  |   └orderStatus.vue      //订单状态
	|  |     |  ├─my              //个人中心相关
	|  |     |  | ├─address.vue   
	|  |     |  | ├─coupon.vue   
	|  |     |  | ├─couponItem.vue
	|  |     |  | ├─customerHelp.vue
	|  |     |  | ├─index.vue
	|  |     |  | ├─infoSet.vue
	|  |     |  | ├─newAddress.vue
	|  |     |  | ├─sharePoster.vue
	|  |     |  | ├─shopCard.vue
	|  |     |  | ├─shopCardBillDetails.vue
	|  |     |  | ├─shopCardDetails.vue
	|  |     |  | ├─shopCartItem.vue
	|  |     |  | ├─userAvatar.vue
	|  |     |  | ├─userInfo.vue
	|  |     |  | ├─weekShare.vue
	|  |     |  | └weekShareItem.vue
	|  |     |  ├─home          //主页
	|  |     |  |  ├─home.vue
	|  |     |  |  ├─index.vue
	|  |     |  |  └search.vue
	|  |     |  ├─comment         //评论
	|  |     |  |    ├─creat.vue
	|  |     |  |    ├─detail.vue
	|  |     |  |    ├─dialog.vue
	|  |     |  |    ├─item.vue
	|  |     |  |    ├─list.vue
	|  |     |  |    └rate.vue
	|  |     |  ├─classify        //分类页
	|  |     |  |    └index.vue
	|  |     |  ├─cart          //购物车
	|  |     |  |  └index.vue
	|  |     |  ├─banActivity  // 商城活动页面，路由也是指定格式
	|  |     |  |      ├─moon  //中秋节活动
	|  |     |  |      |  ├─index.vue
	|  |     |  |      |  ├─img
	|  |     |  |      |  |  ├─01.png
	|  |     |  |      |  |  ├─02.png
	|  |     |  |      |  |  ├─bg.jpg
	|  |     |  |      |  |  └btn.png
	|  |     |  |      ├─invite  //购物卡赠送活动
	|  |     |  |      |   ├─index.vue
	|  |     |  |      |   ├─img
	|  |     |  |      |   |  ├─01.jpg
	|  |     |  |      |   |  ├─bg.png
	|  |     |  |      |   |  ├─close.png
	|  |     |  |      |   |  └pop.png
	|  |     ├─common    //公共组件            
	|  |     |   ├─404.vue              
	|  |     |   ├─alertSetAddress.vue //无可用收货地址时的提示弹窗组件
	|  |     |   ├─autologin.vue   //自动授权
	|  |     |   ├─citySelect.vue  //城市选择
	|  |     |   ├─goTop.vue     //返回顶部
	|  |     |   ├─loading.vue  // loading样式
	|  |     |   ├─login.vue   //登录页面
	|  |     |   ├─menu.vue    //顶部菜单
	|  |     |   ├─wrap.vue    //包含底部导航时 router-view容器
	|  |     |   ├─svg
	|  |     |   |  ├─index.js
	|  |     |   |  └rate.js
	|
	├─dist           //打包后文件目录
	├─config          //项目配置
	|   ├─dev.env.js
	|   ├─index.js
	|   └prod.env.js
	├─build         //项目配置
	|   ├─build.js
	|   ├─check-versions.js
	|   ├─utils.js
	|   ├─vue-loader.conf.js
	|   ├─webpack.base.conf.js
	|   ├─webpack.dev.conf.js
	|   └webpack.prod.conf.js
	└assets  //目录下的图片会被拷贝到dist/img下，如微信分享的头图
	    └card-share.jpg  

### 说明

1. 因为支付问题，项目必须采用history路由模式，且路由path必须为/index/xxx,否则刷新会造成后端404。
2. 前进刷新，后退不熟悉是通过引入第三方组件[vue-navigation](https://github.com/zack24q/vue-navigation)完成的
3. 商城整站没有注册逻辑，没有用户密码，全部通过手机号+短信动态码完成


	