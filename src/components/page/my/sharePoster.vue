<template>
  <!-- 海报分享 -->
  <div class="share-poster-wrap">
    <div class="poster"><img v-lazy="sharePic"></div>
    <ul class="btn-wrap">
      <li @click.stop="handleSharePoster"><img src="../../../../static/img/my/share-poster.png"><span>分享海报</span></li>
      <li @click.stop="handleShareLink"><img src="../../../../static/img/my/share-link.png"><span>分享链接</span></li>
    </ul>
    <div class="mask"
         v-show="showMask"
         @click.stop="showMask = false">
      <img class="tips"
           src="../../../../static/img/my/wx-share-tips.png">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    // const ua = navigator.userAgent.toLowerCase();
    return {
      gid: this.$route.query.id || "",
      sharePic: "",
      showMask: false,
      config: {
        title: "",
        content: "",
        imgUrl: "",
        shortlink: window.location.href,
      }
      // isBSJ :ua.match("zhongchuang") ?true :false,
      // isIos : ua.match("iphone") ?true :false,
      // isZhushou:ua.match("zhushou browser")?true:false,

    }
  },
  methods: {
    //保世界分享(图片)
    openImageShare (def) {
      // 3H5，1助手，2保世界，
      // Vue.prototype.$agent=_ua.match("zhushou browser")?1:_ua.match("zhongchuang")?2:3
      // Vue.prototype.$ios=_ios;
      if (typeof CustomJS !== "undefined" && typeof CustomJS.shareImg !== "undefined" || typeof CustomJS.shareImage !== "undefined") {
        if (!this.$ios) {
          // &x-oss-process=image/resize,h_100,w_100
          // let shareImgUrl = `${def.imgUrl}`
          CustomJS.shareImg('{"title":"' + def.title + '","content": "' + def.content + '","imgUrl":"' + def.imgUrl + '","shortlink":"' + def.shortlink + '","platfrom":""}');
        } else {
          let shareImgUrl = `${def.imgUrl}&x-oss-process=image/resize,h_598,w_390`
          CustomJS.shareImage('{"title":"' + def.title + '","content": "' + def.content + '","imgUrl":"' + shareImgUrl + '","shortlink":"' + def.shortlink + '","platfrom":""}');
        }
        this.sendTongji();
        if(typeof MtaH5 !=="undefined") MtaH5.clickStat("ewm_button"); 
      } else {
        this.$toast("请使用最新版App访问")
      }
    },
    //助手分享(图片)
    openFriendPicShare (def) {
      window.onShareComplete = ()=>{
        this.sendTongji();
      }
      if (typeof CustomJS !== "undefined" && typeof CustomJS.shareOnePicture !== "undefined") {
        CustomJS.shareOnePicture('{"title":"' + def.title + '","content": "' + def.content + '","imgUrl":"' + def.imgUrl + '","shortlink":"' + def.shortlink + '","platfrom":""}');
        if(typeof MtaH5 !=="undefined") MtaH5.clickStat("ewm_button"); 
      } else {
        this.$toast("请使用最新版App访问")
      }

    },
    handleSharePoster () {
      // 3H5，1助手，2保世界，
      const def = {
        title: this.config.title,
        content: this.config.content,
        imgUrl: this.sharePic,
        shortlink: this.config.shortlink,
      };
      // console.log(`${def.imgUrl}&x-oss-process=image/resize,h_100,w_100`)
      // console.log(def)
      if (this.$agent == 1) {
        this.openFriendPicShare(def);
      } else if (this.$agent == 2) {
        this.openImageShare(def);
      } else {
        this.showMask = true;
        // this.sendTongji();
        
      }
    },
    handleShareLink () {
      const def = { ...this.config };
      if (typeof CustomJS !== "undefined" && typeof CustomJS.share !== "undefined") {
        CustomJS.share('{"title":"' + def.title + '","content": "' + def.content + '","imgUrl":"' + def.imgUrl + '","shortlink":"' + def.shortlink + '","platfrom":"","share_type":"4","id":"","type":"","shareId":""}');
        this.sendTongji();
        if(typeof MtaH5 !=="undefined") MtaH5.clickStat("lj_button"); 
      } else {
        this.showMask = true
      }
    },
    getData () {

      this.$axios.post("/wap/Share/image", {
        g_id: this.gid
      })
        .then(res => {
          this.$store.commit('setLoading', false)
          const _data = res.data;
          if (_data.code == 0) {
            this.sharePic = (_data.data.imageUrl || "").replace(/^http:\/\//,"https://");
            this.config.shortlink = _data.data.url || window.location.href;
          }
        });
    },
    getShareConfig () {
      const that=this;
      this.$axios.post("/wap/Goods/getDetail", {
        g_id: this.gid
      })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            const info = _data.data.goods || {};
            this.config.title = "【必抢】" + info.g_name;
            this.config.content = "开门红好礼，限量抢购中！";
            this.config.imgUrl = "https:"+(typeof info.g_images=="string"?info.g_images.split(",")[0]:"//s29.9956.cn/static/common/img/crowdsource_logo_200_200.jpg")+"?x-oss-process=image/resize,h_100,w_100";
            const config={
             ...this.config
            }
            this.getWxConfig((wx_config)=>{
                //微信分享
                if(typeof wx=="undefined") return;
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来， 若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: wx_config.appId, // 必填，公众号的唯一标识
                  timestamp: wx_config.timestamp, // 必填，生成签名的时间戳
                  nonceStr: wx_config.nonceStr, // 必填，生成签名的随机串
                  signature: wx_config.signature, // 必填，签名，见附录1
                  jsApiList: [
                    "onMenuShareTimeline", // 分享到朋友圈
                    "onMenuShareAppMessage", // 分享给朋友
                    "onMenuShareQQ",  // 分享到QQ
                  ]
                });
                wx.ready(function () {
                  // 分享到朋友圈
                  wx.onMenuShareTimeline({
                    title: config.title, // 分享标题
                    desc: config.content, // 分享标题
                    link: config.shortlink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: config.imgUrl, // 分享图标
                    success: function () {
                      console.log("用户调用分享到朋友圈")
                      that.sendTongji();
                    }
                  })
                  wx.onMenuShareAppMessage({
                   title: config.title, // 分享标题
                    desc: config.content, // 分享标题
                    link: config.shortlink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: config.imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      console.log("用户调用分享给微信好友")
                      that.sendTongji();
                    }
                  })
                  wx.onMenuShareQQ({
                   title: config.title, // 分享标题
                    desc: config.content, // 分享标题
                    link: config.shortlink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: config.imgUrl, // 分享图标
                    success: function () {
                      console.log("用户调用分享给QQ好友")
                      that.sendTongji();
                    },
                    cancel: function () {
                      console.log("用户取消分享给QQ好友")
                    }
                  })
                })
                wx.error(function(res){
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    console.log(res);
                });
            });
          }
        });
    },
    //发送统计
    sendTongji () {
      this.$axios.post("/wap/Share/share", {
        g_id: this.gid
      })
    },
    getWxConfig(callback){
      this.$axios.post("/wap/WxChat/getWxConfig")
      .then((res)=>{
        const _data=res.data;
        if(_data.code==0){
          callback(_data.data||{});
        }
      })
    }

  },
  created () {
    this.getData();
    this.getShareConfig();
  }
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$lazyBackColor: #f5f5f5;
.share-poster-wrap {
  position: absolute;
  height: 100%;
  background-color: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .poster {
    margin: 0 auto;
    width: pxToRem(578px);
    position: relative;
    border: 1px solid #eee;
    height: pxToRem(885px);
    margin-top: pxToRem(38px);
    box-shadow: 0px 5px 8px 0px #b6acac66;
    background-color: $lazyBackColor;
    img {
      @include imgCenter();
      width: pxToRem(578px);
    }
  }
  .btn-wrap {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 18px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: pxToRem(578px);
    li {
      width: 40%;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: pxToRem(126px);
      }
      span {
        line-height: 30px;
        color: #353535;
        font-size: 15px;
        margin-top: 10px;
      }
    }
  }
  .mask {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    .tips {
      width: 100%;
      display: block;
    }
  }
}
</style>

