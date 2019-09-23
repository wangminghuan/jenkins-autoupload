<!-- 商品详情 -->
<template>
     <div class="detail-outer-wrap common-scroll-wrap">
         <router-view></router-view>
         <!-- 以下为公共复用部分 start -->
         <!-- 选择商品 -->
         <yd-popup v-model="showSpecPop" position="bottom" height="auto" class="pop-box">
             <section class="pop-content">
             <div class="top">
                 <section class="lf"><img :src="imgArr[0]"></section>
                 <section class="rt"><p>{{pageData.goods.g_name}}</p><span>￥{{skuObj.sku_price}}</span><em>市场价:<b>{{pageData.goods.g_price}}</b></em><i class="close-icon" @click.stop="showSpecPop=false"></i></section>
             </div>
             <div class="mid common-scroll-wrap">
                 <ul class="spec-item common-scroll-view">
                     <li v-for="(item,index) in pageData.goods_spec" :key="index">
                         <em>{{item.spec}}</em>
                         <span v-for="(subItem,subIndex) in item.spec_value" :key="subIndex" @click="handleSelectSpec(index,subItem,subIndex,(item.spec==='起订数量'?true:false))" :class="subItem.selected?'active':''">{{subItem.gsv_name}}</span>
                     </li>
                 </ul>
             </div>
              <ol class="nums-item"><em>数量</em>
              <div class="product-num">
                  <span  class="num-reduce num-btn" @click.stop="handleSubNums(0,sku_stock_num)"></span><input type="tel" v-model="buyNums" maxlength="3" class="num-input" @blur="gotoChangeBlur" /><span class="num-add num-btn" @click.stop="handleSubNums(1,sku_stock_num)"></span>
              </div>
              </ol>
             <div class="btm">
                 <p class="add" @click="handleAddCart">加入购物车</p>
                 <p class="buy" @click="handleClickBuyNow">立即购买</p></div>
             </section>
         </yd-popup>
         <ul class="btm-tools">
             <li class="concat" style="padding-left:5px;" @click="handleJumpIM"><b></b><em>联系卖家</em></li>
             <li class="cart" @click="handleJump('/index/cart')"><b><i ref="shake" v-show="$store.state.cart.nums>0">{{(100>$store.state.cart.nums)?$store.state.cart.nums:'99+'}}</i></b><em>购物车</em></li>
             <li class="add" @click="showSpecPop=true">加入购物车</li>
             <li class="buy" @click="showSpecPop=true">立即购买</li>
         </ul>
         <div class="ball-container" ref="ball"><span :style="ballStyle"></span></div>
         <!-- end -->
     </div>
</template>
<script>
import Vue from "vue";
import { Popup } from "vue-ydui/dist/lib.px/popup";
Vue.component(Popup.name, Popup);
import goTop from　"../../common/goTop";
export default {
  components:{
    goTop,
  },
  data() {
    return {
      hasAddress:true,//是否有默认地址
      timer:null,//定时器
      ballStyle:{},//小球样式
      imgArr: [],
      buyNums:1, //购买数量
      minNum:0,
      gid: this.$route.query.id || "",
      gsn:this.$route.query.gsn || "",
      hasSelectedSpec:[],
      pageData: {
        goods: {},
        goods_coupon: [],
        goods_sku: [],
        goods_spec: []
      },
      showSpecPop:false,//弹出规格选择框
      isInPreviewModel:this.$route.query.preview?true:false,//是否处于预览模式下
      imUrl:"",
    };
  },
  computed:{
     storeSpecPopStatus(val){
       return this.$store.state.detail.isShowSpecPop
    },
    //得到规格名称
    initSpecName(){
        if(this.hasSelectedSpec.length>0){
        return this.hasSelectedSpec.map((item)=>{
            // return item.spec==="起订数量"?"":item.name hjp修改
            if(item.spec==="起订数量"){
              return `${item.name}件`
            }else{
              return `${item.name}`
            }
          })
        }else{
          return false
        }
    },
    //得到最终的库存和skuid
    skuObj(){
      let idArr=this.hasSelectedSpec.map((item)=>{ 
            return item.id
         });
      const arr=this.pageData.goods_sku;
      for(let i=0,len=arr.length;i<len;i++){
            if(idArr.join(",")===arr[i].gsv_ids){
                return arr[i]
            }
      }
      return {
        g_id:0,
        gsv_ids:0,
        sku_id:0,
        sku_price:0,
        sku_stock_num:0,
      }
    },
    sku_stock_num(){
      return this.skuObj.sku_stock_num
    },
    mid(){
      return this.pageData.goods.m_id
    },
  },
  watch:{
    initSpecName(val){
      //通过监听规格变化，向store发送数据，更新子路由页面
      this.$store.commit("setDetailData",{
              type:2,
              data:val
            })
    },
    //通过监听达到store和state同步的结果
    storeSpecPopStatus(val){
      this.showSpecPop=val;
    },
    showSpecPop(val){
       this.$store.commit("setSpecPopStatus",val);
    },
    sku_stock_num(val){
       if(!val || val==0){
         this.buyNums=1;
       }else{
         this.buyNums=this.minNum>0?this.minNum:1 // jzc增加如果有起订数量则等于起订数量 否则默认1
       }
    },
    mid(val){
      const token=this.getCookie("__m_token__");
      this.imUrl="//"+(window.location.port?"s29.dev.bxd365.com":"s29.9956.cn")+"/res/common/im_v1/wap.html?wap_token="+token+"&m_id="+val;
    }
  },
  methods: {
    //输入框失焦 ruleNum:起订数量 max:库存
    gotoChangeBlur(){
      let buyNums = Number(this.buyNums)
      let minNums = Number(this.minNum)
      let num = String(buyNums).match(/^[0-9]*$/)?true:false;
      if(!num){
        if(minNums){
          this.buyNums = minNums;
        }else{
          this.buyNums = 1;
        }
        this.$toast.error('只能输入数字哦~')
      }else if(buyNums < minNums){
        this.buyNums = minNums;
      }else if(buyNums === 0){
        if(minNums){
          this.buyNums = minNums;
        }else{
          this.buyNums = 1;
        }
      }else if(String(buyNums).indexOf('.')>-1){
        if(minNums){
          this.buyNums = minNums;
        }else{
          this.buyNums = 1;
        }
        this.$toast.error('不能输入小数')
      }else if(buyNums >= 1000){
        this.$toast.error('数量不能超过1000哦~')
        return false
      }
    },
    //购物数量设置
    handleSubNums(type,max){
      //购物数量设置
       if(type==0){ //减法  hjp修改 去掉减法判断
        // if(max==0){ //如果没有库存，不能减少
        //    this.buyNums=0;
        // }else{
        //   this.buyNums<2?this.buyNums=1:this.buyNums--;
        // }
        // console.log(type,max,this.buyNums,this.minNum)
        if(this.buyNums<=this.minNum&&this.minNum!=0){  //jzc
          this.$toast("不能低于最小限购量哦~")
        }else{
          this.buyNums<2?this.buyNums=1:this.buyNums--;
        }
      }else{ //加法
          if(this.buyNums==max){
              this.$toast.error("库存不足")
          }else{
            this.buyNums++
          }
      }
    },
    //添加购物车动画
    animationBall(callback){
      let arrX=[],arrY=[],i=0;
      for(let x=0;x>-151;x--){
            let y=-(4/225)*x*x-(8/3)*x;
            arrX.push(x)
            arrY.push(y)            
        }
      this.$refs.ball.style.display="block";
      this.timer=setInterval(()=>{
          i=i+2;
          this.ballStyle={
                width:(14-(14/150)*i)+'px',
                height:(14-(14/150)*i)+'px',
                'transform': 'translate('+arrX[i]+'px,-'+arrY[i]+'px)',
                 '-webkit-transform': 'translate('+arrX[i]+'px,-'+arrY[i]+'px)'
            }
         if(i>=150){
             clearInterval(this.timer);
             this.$refs.ball.style.display="none";
             this.ballStyle={};
             callback()
         }
        },10)
    },
    //点击规格按钮
    handleSelectSpec(index,sitem,sinx,_type){
      this.pageData.goods_spec[index].spec_value.map((vitem,vindex)=>{
            if(sinx==vindex){
                 vitem.selected=1;
                 this.hasSelectedSpec.splice(index,1,{
                    id:vitem.gsv_id,
                    name:vitem.gsv_name,
                    spec:this.pageData.goods_spec[index].spec
                  })
              }else{
                  vitem.selected=0
              }
      })
      //起订数量特殊处理
      if(_type){
        this.minNum=this.buyNums=sitem.gsv_name;
      }
    },

    //加入购物车
    handleAddCart(){
      if(typeof MtaH5 !=="undefined"){
         MtaH5.clickStat("home_bannerfour");
      }
      if(this.isInPreviewModel) return;
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Cart/addCart", {
          g_id: this.skuObj.g_id,
          sku_id: this.skuObj.sku_id,
          ct_num:this.buyNums,
        })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
             this.showSpecPop=false
             setTimeout(()=>{
              this.animationBall(()=>{
                this.$refs.shake.className="shake";
                let cartNums=parseInt(this.$store.state.cart.nums)+parseInt(this.buyNums);
                 this.$store.commit('setCartNums',parseInt(cartNums));
                setTimeout(()=>{
                  this.$refs.shake.className="";
                },500)
              },800)
             })
          }
          this.$store.commit("setLoading", false);
        });
    },
    //获取用户是否有默认地址
    getUserHasAddress(callback){
       this.$axios.post("/wap/Address/lists").then(res => {
        const _data = res.data;
        if(_data.code==0){
            const list= _data.data && _data.data.data instanceof Array ? _data.data.data : [];
            this.hasAddress=list.length>0?true:false;
            callback()
        }
      });
    },
    //立即购买按钮
    handleClickBuyNow() {
      if(this.isInPreviewModel) return;
      this.getUserHasAddress(()=>{
      if(!this.hasAddress){
          this.$store.commit("setNewAddressPop",true)
      }else{
      this.$store.commit("setLoading", true);
      this.$axios
        .post("/wap/Order/nowBuy", {
          g_id: this.skuObj.g_id,
          sku_id: this.skuObj.sku_id,
          ct_num:this.buyNums,
        })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            this.$router.push({
              path: "/index/order_confirm",
              query: { tid: _data.data.ct_id }
            });
          }else{
            this.$toast.error(_data.message)
          }
          this.$store.commit("setLoading", false);
        });
      }
      })
    },
    //初始化数据
    initData(obj){
      //容错处理
     if(!(obj.goods_spec instanceof Array)) obj.goods_spec=[];
     if(!(obj.goods_sku instanceof Array)) obj.goods_sku=[];
     if(!(obj.goods_coupon instanceof Array)) obj.goods_coupon=[];
     if(!(obj.goods instanceof Object)) obj.goods={};
      //容错 end
         obj.goods_spec.map((item)=>{
                if(item.spec=='起订数量'){ //jzc起订数量记录第一个
                  this.minNum=item.spec_value[0].gsv_name
                }
                if(typeof item.spec_value[0]=="object"){
                  item.spec_value[0].selected=1;
                  this.hasSelectedSpec.push({
                    id:item.spec_value[0].gsv_id,
                    name:item.spec_value[0].gsv_name,
                    spec:item.spec
                  })
                }
            })
            //如果第一个产品规格数量为0 ，特殊处理
            if(obj.goods_sku[0] && obj.goods_sku[0].sku_stock_num ==0){
               this.buyNums=1; //hjp修改 原始代码：this.buyNums=0 修改成:this.buyNums=1
            }
             //过滤图片中的http链接为https链接
             if(obj.goods && typeof obj.goods.g_description =="string"){
                obj.goods.g_description=obj.goods.g_description.replace(/src="http:/g,'src="')
             }
             this.pageData = obj;
             this.pageData.goods_coupon.map((e)=>{
              e.cn_startTime=e.cn_startTime.substr(0,10)
              e.cn_endTime=e.cn_endTime.substr(0,10)
            })
            this.imgArr =
              obj.goods && typeof obj.goods.g_images == "string"
                ? obj.goods.g_images.split(",")
                : [];
            
            //将数据组装存在store中，供子路由加载
            const _page=JSON.parse(JSON.stringify( this.pageData));
            _page.imgArr=this.imgArr;
            _page.initSpecName=this.initSpecName;
            this.$store.commit("setDetailData",{
              type:1,
              data:_page
            })
            //解决loop模式下 swiper最后一个的lazy不会被替换的问题
            // setTimeout(()=>{
            //     const swipe=document.querySelectorAll(".swipe-item-1");
            //     if(swipe.length==1) return;
            //     const node=swipe[swipe.length-1];
            //     node && node.setAttribute("src",node.getAttribute("data-src"))
            // })
            //end
    },
    //获取信息详情数据
    getpageData() {
      this.$axios
        .post("/wap/Goods/getDetail", {
          g_id: this.gid,
          g_sn: this.gsn
        })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            this.initData(_data.data)
          } else {
            this.$toast.error(_data.message);
            setTimeout(() => {
                this.$router.push({path:"/index/home"}) 
            }, 1500);
          }
          this.$store.commit("setLoading", false);
        });
    },
   handleJump(path) {
      if(this.isInPreviewModel) return;
      this.$router.push({
        path: path
      });
    },
   handleJumpIM(){
      if(this.isInPreviewModel) return;
      if(this.getCookie("__m_token__") && this.imUrl){
           window.location.href=this.imUrl
       }else{
          this.$router.push({path:"/index/login",query:{
            redir:window.location.pathname+window.location.search
        }})
       }
    },
  },
  created() {
    //数据拉取,非预览模式下通过接口获取
    if(!this.isInPreviewModel){
      this.getpageData()
      this.getCartNums();
    }
  },
  mounted(){
    if(this.isInPreviewModel){
      //预览模式下通过监听postmessage获取父级数据
      this.$store.commit("setLoading", false);
      const that=this;
      window.addEventListener('message', function(ev) {
        var data = ev.data;
        that.initData(data)
       }, false);
    }
  }
};
</script>
<style lang="scss">
@import "static/css/mixin.scss";
$border1px: 1px solid #f5f5f5;
$red: #dd2727;
$yellow: #ff9600;
.ball-container{
  position: fixed;
  bottom:pxToRem(100px);
  right: pxToRem(300px);
  width: 160px;
  height: 110px;
  z-index: 999999;
  display: none;
  span{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 14px;
    height: 14px;
    background-color: $red;
    border-radius: 50%;
  }
}

.detail-outer-wrap {
  .product-num{
          border: 1px solid #e3e3e3;
          display: flex;
          text-align: center;
          // border-radius: 4px;
          .num-btn{
            width: 24px;
            height: 24px;
            background: #f7f7f7;
            margin: 0 auto;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            &::after{
              content: "";
              display: block; 
              margin:0 auto;
              background-repeat: no-repeat;
            }
          }
         
          .num-reduce::after {
             width: 24px;
            height: 24px;
             background: url("../../../../static/img/cart/jian.png") no-repeat center;

                background-size: 28px;
          }
          .num-add::after{
            width: 24px;
            height: 24px;
            background: url("../../../../static/img/cart/jia.png")  no-repeat center;
            background-size: 28px;
          }
          .num-input{
            width: 42px;
            line-height: 24px;
            border: none;
            text-align: center;
            display: inline-block;
            color: #dd2727;
          }
        }
  .pop-coupon-box{
      overflow: inherit;
      .common-scroll-wrap{
         height:pxToRem(232*2+50px);
         margin-top:pxToRem(124px); 
      }
      .common-scroll-view{
        padding-top:4px;
      }
    }
  .pop-box {
    .common-scroll-wrap{
         height:188px;
      }
    .yd-popup {
      background-color: transparent;
    }
    .pop-content {
      //    overflow-y:auto;
      margin-top: 22px;
      background-color: #fff;
      .close-icon {
        position: absolute;
        right: 0;
        top: 0;
      }
      .rt{
        span{
          font-size: 16px
        }
      }
      
    }
    .top {
      display: flex;
      padding: 0 pxToRem(30px);
      border-bottom: $border1px;
      height: 92px;
      position: relative;
      .lf {
        position: absolute;
        width: pxToRem(200px);
        height: pxToRem(200px);
        border-radius: 6px;
        overflow: hidden;
        border: $border1px;
        top: -22px;
        img {
          width: 100%;
          height: auto;
        }
      }
      .rt {
        align-self: center;
        font-size: 14px;
        padding-left: pxToRem(218px);
        padding-right: pxToRem(40px);
        p {
          line-height: 22px;
          color: #353535;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        span {
          color: $red;
        }
        em{
          color:#a9a9a9;
          margin-left:pxToRem(17px);
          font-size:12px;
          b{
            text-decoration:line-through;
          }
        }
      }
    }
    .nums-item {
        // position: fixed;
        // bottom:0;
        display: flex;
        align-items: center;
        height: 56px;
        em {
          padding-left: pxToRem(24px);
          padding-right: pxToRem(30px);
          color: #555555;
        }
      }
    .mid {
      overflow: auto;
      .spec-item {
        // max-height: 184px;
        // overflow-y: scroll;
        li {
          border-bottom: $border1px;
        }
        em {
          display: block;
          line-height: 42px;
          margin-left: pxToRem(24px);
          color: #555555;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          margin-right: pxToRem(24px);
        }
        span {
          display: inline-block;
          padding: 5px 17px;
          border: $border1px;
          border-radius: 6px;
          font-size: 14px;
          margin-left: pxToRem(40px);
          margin-bottom: 14px;
          color: #353535;
          box-sizing: border-box;
          max-width:89%;
          word-wrap:break-word;
        }
        span.active{
           border-color: #dd2727;
           color: #dd2727
        }
      }
      
    }
    .btm {
      display: flex;
      p {
        width: 50%;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 16px;
      }
      p:nth-of-type(1) {
        background-color: $yellow;
      }
      p:nth-of-type(2) {
        background-color: $red;
      }
    }
  }
  .btm-tools {
    position: fixed;
    width: 100%;
    display: flex;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    justify-content: space-around;
    height: pxToRem(100px);
    background-color: #fff;
    border-top:1px solid #f5f5f5;
    .cart,
    .concat {
      width: pxToRem(115px);
      height: 100%;
      color: #555555;
      display: flex;
      flex-direction: column;
      align-content: center;
      text-align: center;
      justify-content: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      b {
        width: 18px;
        height: 20px;
        background-size: 100% auto;
        margin: 0 auto;
        background-repeat: no-repeat;
      }
    }
    
    li.cart {
      position: relative;
      width: pxToRem(95px);
      i {
        color: #fff;
        font-size: 12px;
        position: relative;
        display: inline-block;
        border-radius: 1000px;
        line-height: 1;
        padding: 3px 6px;
        white-space: nowrap;
        background-color: $red;
        transform: scale(0.75);
        position: absolute;
        right: pxToRem(16px);
        top: 0;
      }
      i.shake{
        animation: shake 0.5s linear 1;
      }
      b {
        background-image: url("../../../../static/img/other/cart.png");
      }
    }
    li.concat {
      b {
        background-image: url("../../../../static/img/other/concat.png");
      }
      em{
        overflow: hidden;
      text-overflow: ellipsis;
      }
    }
    .add,
    .buy {
      width: pxToRem(270px);
      height: 100%;
      color: #fff;
      text-align: center;
      align-self: center;
      line-height: pxToRem(100px);
      font-size: 16px;
    }
    li.add {
      background-color: $yellow;
    }
    li.buy {
      background-color: $red;
    }
  }
}
</style>