<!-- 购物车首页 -->
<template>
  <div v-show="isLoadOver" style="height:100%;width:100%">
  <section v-if="isEmpty" class="cart-empty-wrap">
    <img src="../../../../static/img/cart/empty.png">
    <p>购物车是空的</p>
    <router-link to="/index/home" tag="span">前往购物</router-link>
  </section>
  <div v-else  class="cart-wrap common-scroll-wrap">
    <section class="list-wrap common-scroll-view">
      <div class="top-info">
        <span>商品质量保证</span>
        <span>七天无忧退货</span>
        <span>48小时快速退款</span>
      </div>
      <!-- 极夫特商城 -->
      <section v-if="isShowGift"  v-for="(item,index) in datalist.gift" class="goodsul-wrap" :key="index">
        <div class="goods-shop" v-if="index<1">
          <span @click="()=>handleSelecteGiftAll()"><span :class="['common-checkbox-icon',{'checked':isGiftCheckAll}]"><i></i></span></span>
          <span class="titl">极夫特商城</span>
        </div>
        <section v-for="(res,resindex) in item" class="goods-ul" :key="resindex">
            <section class="goods-item yd-checklist-item">
              <p class="check-item-wrap" @click="handleSelected(index,resindex,res)"><span :class="['common-checkbox-icon',{'checked':res.selected}]"><i></i></span></p>
              <div class="items-content" >
                <div class="pic" @click="handleJumpDetail(res)"><img v-lazy="res.g_images" ></div>
                <div class="txt">
                  <h6 class="titl">{{res.g_name}}</h6>
                  <!-- <span class="spec" v-for="(sku,skuindex) in res.sku_info" :key="skuindex">{{sku.spec}}: {{sku.spec_value}} &nbsp;</span> hjp修改 -->
                  <div class="specgui">规格: &nbsp;<span class="spec" v-for="(sku,skuindex) in res.sku_info" :key="skuindex">{{sku.spec_value}}, &nbsp;</span></div>
                  <div class="price-nums">
                    <p class="price">
                      <b>￥</b>
                      <span>{{res.ct_price}}</span>
                    </p>
                    <div class="product-num">
                        <span  class="num-reduce num-btn" @click.stop="handleSubNums('gift',index,resindex,res,2)"></span><b class="num-input">{{res.ct_num}}</b><span  class="num-add num-btn" @click.stop="handleSubNums('gift',index,resindex,res,1)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </section>
      </section>
 <!-- 服务商列表 -->
      <section v-if="isShowMerchant" v-for="(item,index) in datalist.merchant" class="goodsul-wrap" :key="index+1000">
        <div class="goods-shop" v-if="item[0]&& item[0].ct_id">
          <span @click="handleSelecteShopAll(index)"><span :class="['common-checkbox-icon',{'checked':isShopCheckAll[index]}]" ><i></i></span></span>
          <span class="titl">{{item[0]&& item[0].shop_name ?item[0].shop_name:'未知店铺'}}</span>
        </div>
        <section v-for="(res,resindex) in item" class="goods-ul" :key="res.ct_id" v-if="res.ct_id">
            <section class="goods-item yd-checklist-item">
              <p class="check-item-wrap" @click="handleSelectedShop(index,resindex,res)"><span :class="['common-checkbox-icon',{'checked':res.selected}]"><i></i></span></p>
              <div class="items-content">
                <div class="pic" @click="handleJumpDetail(res)"><img v-lazy="res.g_images"></div>
                <div class="txt">
                  <h6 class="titl">{{res.g_name}}</h6>
                  <!-- <span class="spec" v-for="(sku,skuindex) in res.sku_info" :key="skuindex">{{sku.spec}}: {{sku.spec_value}} &nbsp;</span> hjp修改 -->
                  <div class="specgui"><em>规格: &nbsp;</em><span class="spec" v-for="(sku,skuindex) in res.sku_info" :key="skuindex">{{sku.spec_value}}, &nbsp;</span></div>
                  <div class="price-nums">
                    <p class="price">
                      <b>￥</b>
                      <span>{{res.ct_price}}</span>
                    </p>
                    <div class="product-num">
                        <span  class="num-reduce num-btn" @click.stop="handleSubNums('merchant',index,resindex,res,2)"></span><b class="num-input">{{res.ct_num}}</b><span  class="num-add num-btn" @click.stop="handleSubNums('merchant',index,resindex,res,1)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </section>
      </section>
      <section>
        <!-- 失效商品列表 -->
      <section class="goodsul-wrap" v-if="isShowInvalid">
      <p class="goods-shop invalid-title"><span>{{"失效商品"+invalidList.length+"件"}}</span><em @click="clearInvalidGoods">清空失效商品</em></p>
      <div class="yd-checklist-item goods-item invalid-item" v-for="(item,index) in invalidList" :key="index"> 
              <p class="tips-lf">失效</p>
              <div class="items-content">
                <div class="pic"><img v-lazy="item.g_images"></div>
                <div class="txt">
                  <h6 class="titl">{{item.g_name}}</h6>
                  <!-- <div class="spec" v-for="(sku,skuindex) in item.sku_info" :key="skuindex">{{sku.spec}}: {{sku.spec_value}} &nbsp;</div> hjp修改 -->
                  <div class="specgui"><em>规格: &nbsp;</em><div class="spec" v-for="(sku,skuindex) in item.sku_info" :key="skuindex">{{sku.spec}}: {{sku.spec_value}} &nbsp;</div></div>
                </div>
              </div>
      </div>
      </section>
      </section>
    </section>
    <section class="opera-wrap">
      <div class="lf">
        <div @click="handleSelectedGoodsAll"><span :class="['common-checkbox-icon',{'checked':selectedAll}]"><i></i></span></div>
        <p style="padding-right:0.2rem;color:#666;">全选</p>
        <p @click="handleEdit">{{!isEdit?'编辑':'完成'}}</p>
      </div>
      <div class="rt">
        <p v-if="!isEdit">
          <span>￥{{(Number(allPrice)).toFixed(2)}}</span>
          <em>不包含运费</em>
        </p>
        <div v-if="!isEdit" class="btn" @click.stop="handleClickBalance">去结算</div>
        <div v-else class="btn" @click.stop="handleDelectGoods">删除</div>
      </div>
    </section>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoadOver:false,//是否加载完毕
      isEmpty:false, //判断购物车是否有数据
      originDatalist:{
        gift:[],
        merchant:[]
      },
      temp:{}, //临时数据
      datalist:{
        gift:[],
        merchant:[]
      }, //获取原始数据
      invalidList:[],//失效商品列表
      isShopCheckAll:[], //商家全选标识
      isGiftCheckAll:false, //极夫特商城全选标识
      giftSelectd:[], //极夫特已选
      giftAllLens:0, //极夫特所有商品长度
      merchantObj:{}, //商家选择数据
      allPrice:'0.00', //总价格
      isEdit: false,
      selectedAll:false,
      isNotDelet:true,
    }
  },
  computed:{
    //是否展示极夫特
    isShowGift(){
      return this.datalist.gift.length>0 && this.datalist.gift[0].length>0 ?true:false
    },
    //是否展示服务商
    isShowMerchant(){
     return this.datalist.merchant.length>0 && this.datalist.merchant[0].length>0 ?true:false
    },
    //是否失效商品
    isShowInvalid(){
     return this.invalidList.length>0?true:false
    }
  },
  methods: {
    //防止缓存，清除数据
    clearState(){
      this.isLoadOver=false;//是否加载完毕
      this.numReduce=true; //减号类名
      this.isEmpty=false; //判断购物车是否有数据
      this.originDatalist={
        gift:[],
        merchant:[]
      };
      this.temp={}; //临时数据
      this.datalist={
        gift:[],
        merchant:[]
      }, //获取原始数据
      this.invalidList=[];//失效商品列表
      this.isShopCheckAll=[]; //商家全选标识
      this.isGiftCheckAll=false; //极夫特商城全选标识
      this.giftSelectd=[]; //极夫特已选
      this.giftAllLens=0; //极夫特所有商品长度
      this.merchantObj={}; //商家选择数据
      this.allPrice='0.00'; //总价格
      this.isEdit= false;
      this.selectedAll=false;
      this.isNotDelet=true;
    },
    handleJumpDetail(item){
      this.$router.push({path:"/index/detail",query:{id:item.g_sn}})
    },
    //编辑点击
    handleEdit(){
        this.isEdit=!this.isEdit;
        if(this.isEdit){
          //存储数据
          this.temp.dataList=JSON.parse(JSON.stringify(this.datalist))
          this.temp.giftSelectd=JSON.parse(JSON.stringify(this.giftSelectd))
          this.temp.isGiftCheckAll=this.isGiftCheckAll;
          this.temp.merchantObj=JSON.parse(JSON.stringify(this.merchantObj))
          this.temp.isShopCheckAll=JSON.parse(JSON.stringify(this.isShopCheckAll))
          this.temp.selectedAll=this.selectedAll;
          this.temp.allPrice=this.allPrice;
          //设置数据
          this.datalist=JSON.parse(JSON.stringify(this.originDatalist))
          this.isGiftCheckAll=false;
          this.giftSelectd=[];
          for(let key in this.merchantObj){
            this.merchantObj[key].selected=[]; 
          }
          this.isShopCheckAll=[...new Array(this.isShopCheckAll.length).fill(false)];
          this.selectedAll=false;
          this.allPrice="0.00";
        }else if(this.isNotDelet){
          //数据恢复
          this.datalist=JSON.parse(JSON.stringify(this.temp.dataList))
          this.giftSelectd=JSON.parse(JSON.stringify(this.temp.giftSelectd))
          this.isGiftCheckAll=this.temp.isGiftCheckAll;
          this.merchantObj=JSON.parse(JSON.stringify(this.temp.merchantObj))
          this.isShopCheckAll=JSON.parse(JSON.stringify(this.temp.isShopCheckAll))
          this.selectedAll=this.temp.selectedAll;
          this.allPrice=this.temp.allPrice;
        }else{
          //删除状态重置
          this.isNotDelet=true;
        }
    },
    //极夫特全选
    handleSelecteGiftAll(flag){
        this.giftSelectd=[];
        const value=typeof flag!="undefined"?flag:!this.isGiftCheckAll
        this.datalist.gift && this.datalist.gift.map((item)=>{
            item.map((sitem)=>{
              sitem.selected=value
              if(sitem.selected) this.giftSelectd.push({
              id:sitem.ct_id,
              price:sitem.ct_price,
              nums:sitem.ct_num
             })
            })
        })
       this.isGiftCheckAll=value
       this.getTotalPrice()
       typeof flag=="undefined" && this.checkIsSelectedAll()//点击全选按钮的时候不检测是否全选
    },
    //极夫特单选
    handleSelected(index,resindex,res){
      
      //重置单个状态
          this.datalist.gift[index][resindex].selected=!this.datalist.gift[index][resindex].selected
        //修改选择列表数据
           this.datalist.gift[index][resindex].selected?this.giftSelectd.push({
             id:res.ct_id,
             price:res.ct_price,
             nums:res.ct_num
             }):this.giftSelectd.splice(this.getGoodsIndexUseId(this.giftSelectd,res.ct_id),1)
          this.isGiftCheckAll=(this.giftSelectd.length<this.giftAllLens)?false:true; //检测是否全选
          this.getTotalPrice()
          this.checkIsSelectedAll();
    },
    //商家全选
    handleSelecteShopAll(index,flag){
        this.merchantObj["n_"+index].selected=[];
        const value=typeof flag!="undefined"?flag:!this.isShopCheckAll[index];
        this.datalist.merchant[index].map((sitem)=>{
              sitem.selected=value
              if(sitem.selected) this.merchantObj["n_"+index].selected.push({
              id:sitem.ct_id,
              price:sitem.ct_price,
              nums:sitem.ct_num
             })
        })
       this.isShopCheckAll[index]=value;
       this.getTotalPrice()
       typeof flag=="undefined" && this.checkIsSelectedAll();//点击全选按钮的时候不检测是否全选
       
    },
    //商家单选
    handleSelectedShop(index,resindex,res){
     //重置单个状态
          this.datalist.merchant[index][resindex].selected=!this.datalist.merchant[index][resindex].selected
        //修改选择列表数据
        const obj=this.merchantObj["n_"+index];
           this.datalist.merchant[index][resindex].selected?obj.selected.push({
             id:res.ct_id,
             price:res.ct_price,
             nums:res.ct_num
             }):obj.selected.splice(this.getGoodsIndexUseId(obj.selected,res.ct_id),1)
          this.isShopCheckAll[index]=(obj.selected.length<obj.lens)?false:true; //检测是否全选
          this.getTotalPrice()
          this.checkIsSelectedAll()
          
    },
    //检测是否全选
    checkIsSelectedAll(){
        let isShopCheckAll=true;
        for(let key in this.merchantObj){
            if(this.merchantObj[key].selected.length!==this.merchantObj[key].lens){
               isShopCheckAll=false
               break;
            }; 
          }
        this.selectedAll= (this.isShowGift?this.isGiftCheckAll:true) && (this.isShowMerchant?isShopCheckAll:true) ? true:false; //检测是否全选
    },
    //底部全选
    handleSelectedGoodsAll(){
       this.selectedAll=!this.selectedAll
       this.handleSelecteGiftAll(this.selectedAll);
       for(let key in this.merchantObj){
         this.handleSelecteShopAll(parseInt(key.split("_")[1]),this.selectedAll)
       }
        // this.getTotalPrice()
    },
    //通过id获取索引
    getGoodsIndexUseId(arr,id){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==id) return i
        }
        return -1
    },
    //获取所有选择项
    getAllSelectedItem(){
         let result=this.giftSelectd;
          for(let key in this.merchantObj){
            result = result.concat(this.merchantObj[key].selected)
          }
          return result;
    },
    //计算价格
    getTotalPrice(){
         let total=0;
         const arr=(this.getAllSelectedItem())
         arr.map((item,index)=>{
           total+=parseFloat(item.price)*100*item.nums
         })
         this.allPrice=total/100;
    },
    //商品数量加减
    handleSubNums(key,index,resindex,res,type){
          //  限制起订数量  res.sku_info
          let flag=false;
          res.sku_info.map((e)=>{
            if(e.spec=='起订数量'&&res.ct_num==e.spec_value&&type==2){
              res.ct_num=e.spec_value;
              flag=true;
              this.$toast("不能低于最小限购量哦~")
            }
          })
      if(flag) return
      this.$store.commit("setLoading", false);
      this.$axios
      .post('/wap/Cart/updateCart',{
        'ct_id':res.ct_id,
        'type':type
        })
      .then(resp=>{
        const _data = resp.data;
        if(_data.code == 0){
          //type ：1 是加 2是减
           let cartNums=parseInt(this.$store.state.cart.nums)+(type==1?1:-1);
           this.$store.commit('setCartNums',parseInt(cartNums));
          //没有选择不计算价格
           if(type==2 && res.ct_num==1) return;
           //动态计算价格
           let nums=this.datalist[key][index][resindex].ct_num;
           type==1?nums++:nums--;
           this.datalist[key][index][resindex].ct_num=nums;
           if(!res.selected) return;
           if(key=="gift"){
             this.giftSelectd[this.getGoodsIndexUseId(this.giftSelectd,res.ct_id)].nums=nums;
           }else{
              (this.merchantObj["n_"+index].selected)[this.getGoodsIndexUseId((this.merchantObj["n_"+index].selected),res.ct_id)].nums=nums;
           }
           this.getTotalPrice();
        }
    })
    },
    //获取所有选择id
    getAllSelectedGoodsIdAndNums(){
      let arr=[],nums=[];
      this.getAllSelectedItem().map((item)=>{
          arr.push(item.id)
          nums.push(item.nums)
      })
      return {
        id:arr,
        nums:nums
      }
    },
    //删除商品
    handleDelectGoods(){
      const idArr=this.getAllSelectedGoodsIdAndNums().id;
      if(idArr.length==0) {
        this.$toast.error("请选择要删除的商品")
        return;
      }
      this.$dialog("确认删除？",()=>{
          this.$store.commit("setLoading", true);
          this.$axios
          .post('/wap/Cart/deleteCart',{
            ct_id:idArr.join(",")
          })
          .then(res=>{
              const _data=res.data;
              if(_data.code==0){
                    this.requeStcartlistData();
                    //更新购物车数量
                    this.getCartNums();
                    this.isNotDelet=false;
              }
              this.$store.commit("setLoading", false);
          })
      })
    },
    //清空失效商品
    clearInvalidGoods(){
      this.$dialog("确认清空失效商品？",()=>{ 
         this.$store.commit("setLoading", true);
         let idArr=[];
         this.invalidList.map((item)=>{
            idArr.push(item.ct_id)
         })
          this.$axios
          .post('/wap/Cart/deleteCart',{
            ct_id:idArr.join(",")
          })
          .then(res=>{
              const _data=res.data;
              if(_data.code==0){
                    this.invalidList=[];
              }
              this.$store.commit("setLoading", false);
              //如果都没有则展示空标识
              if(!this.isShowGift && !this.isShowMerchant){
                   this.isEmpty=true;  
              }
          })
      }) 
    },
    //请求购物车列表
    requeStcartlistData(){
      this.clearState();//初始化data,防止缓存
      this.$store.commit("setLoading", true);
      this.$axios
      .post('/wap/Cart/cartList')
      .then(res=>{
        this.isLoadOver=true;
        const _data = res.data;
        if(_data.code==0){
        const merchantLens=_data.data.merchant && _data.data.merchant instanceof Array?_data.data.merchant.length:0;
        //购物车为空展示缺省页面(极夫特为空，且商家为空)
        if((!_data.data.gift || (_data.data.gift instanceof Array && _data.data.gift.length==0)) && (!_data.data.merchant || (_data.data.merchant instanceof Array && _data.data.merchant.length==0))){
           this.isEmpty=true
        }else{
         let validGift=[],validMerchant=[];//有效的商品列表
        _data.data.gift && _data.data.gift.map((item,index)=>{
            let temp=[];
            item.map((subitem,subIndex)=>{
                subitem.selected=0;
                if(subitem.ct_status == '0'){
                  this.giftAllLens++;
                  temp.push(subitem)
                }else{
                  this.invalidList.push(subitem)
                };
            })
            validGift.push(temp)
        })
        _data.data.merchant&&_data.data.merchant.map((item,index)=>{
            this.merchantObj["n_"+index]={
              selected:[],
              lens:0
            }
            let temp=[];
            item.map((subitem,subindex)=>{
                subitem.selected=0;
                if(subitem.ct_status == '0'){
                    this.merchantObj["n_"+index].lens++;
                    temp.push(subitem)
                }else{
                  this.invalidList.push(subitem)
                } 
            })
            validMerchant.push(temp);
        })
        const finalData={
          freightAmount:_data.data.freightAmount,
          goodsTotalAmount:_data.data.goodsTotalAmount,
          offerAmount:_data.data.offerAmount,
          totalAmount:_data.data.totalAmount,
          gift:validGift,
          merchant:validMerchant
        }
        let newArr=new Array(merchantLens);
        newArr.map((item)=>{
          item=false
        })
        this.isShopCheckAll=newArr;
        this.datalist = JSON.parse(JSON.stringify(finalData));
        this.originDatalist=JSON.parse(JSON.stringify(finalData));
        }
      }
        this.$store.commit("setLoading", false);
      })
    },
    //去结算
    handleClickBalance() {
      const goodArr=this.getAllSelectedGoodsIdAndNums().id;
      if(goodArr.length<1){
        this.$toast.error('请选择商品')
        return 
      }
      this.$store.commit("setLoading", true);
      this.$axios
      .post('/wap/Address/lists')
      .then(res=>{
        const _data = res.data;
        if(_data.code == 0){
           const list= _data.data && _data.data.data instanceof Array ? _data.data.data : [];
          if(list.length>0){
              this.$router.push({path:'/index/order_confirm',query:{
                tid:goodArr.join(",")
              }})
          }else{
            this.$store.commit("setNewAddressPop",true)
          }
        }
        this.$store.commit("setLoading", false);
      })
    },
  },
  activated(){
     this.requeStcartlistData();
  },
}
</script>
<style lang="scss">
@import 'static/css/mixin.scss';
$grey: #959595;
$lazyBackColor:#f5f5f5;
.cart-wrap {
  padding-bottom: pxToRem(100px) + pxToRem(100px) + pxToRem(24px);
  .list-wrap {
    // background-color: #fff;
    padding-bottom: pxToRem(204px);
    .top-info {
      display: flex;
      justify-content: space-between;
      height: pxToRem(78px);
      font-size: 14px;
      color: #e3b23c;
      padding: 0 pxToRem(15px);
      box-sizing: border-box;
      justify-items: center;
      background-color: #fff;
      span {
        font-size: pxToRem(28px);
        flex:1;
        line-height: pxToRem(78px);
        padding-left: pxToRem(38px);
        background-size: 15px auto;
        background-repeat: no-repeat;
        background-image: url('../../../../static/img/cart/icon.png');
        background-position-y: center;
        background-position-x: 0;
      }
    }
    .check-item-wrap{
          width: 22px;
          height: 3.12rem;
          display: flex;
          align-items: center;
    }
    .goods-shop {
      height: pxToRem(88px);
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 pxToRem(30px);
      .titl{
            margin-left: 10px;
            font-size: 16px;
            color: #666;
      }
    }
    .invalid-title{
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      span{
        color: #959595
      }
      em{
        color: #dd2727
      }
    }
    .goodsul-wrap{
      background-color: #fff;
      .goods-ul:nth-last-child(1) .goods-item{
        border:0;
      }
    }
    .goods-item {
      margin: 0 pxToRem(30px);
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      .goods-check{
        width:20px;
        height: pxToRem(234px);
      }
      h3 {
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        height: pxToRem(88px);
        font-size: 14px;
        color: #353535;
      }
      .items-content {
        display: flex;
        align-items: center;
        height: pxToRem(234px);
        width:100%;
        padding-left: pxToRem(24px);
        .pic {
          width: pxToRem(182px);
          border: 1px solid #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: pxToRem(25px);
          box-sizing: border-box;
          position: relative;
          background-color:$lazyBackColor;
          img{
            @include imgCenter()
          }
        }
        .txt{
          min-width:50%;
          flex:1;
        }
        .txt,
        .pic {
          height: pxToRem(182px);
          position: relative;
        }
        .titl {
          line-height: pxToRem(40px);
          font-size: 14px;
          color: #353535;
          // height: pxToRem(70px);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .specgui{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width:pxToRem(400px);
          // color:#959595;
          // width:100%;
          // overflow: hidden;
          // word-break:break-all;
          // text-overflow: ellipsis;
          // display:-webkit-box;
          // -webkit-line-clamp:2;
          // -webkit-box-orient:vertical;
          // display: flex;
        }
        .spec {
          color: $grey;
          display: inline-block;
          line-height: pxToRem(30px);
          margin-top: pxToRem(15px);
          // text-overflow: ellipsis;
          // -webkit-line-clamp:1;
          // -webkit-box-orient:vertical;
        }
        .price-nums {
          display: flex;
          position: absolute;
          bottom: 0;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          span{
            font-size: 16px;
          }
        }
        .price {
          color: #dd2727;
        }
        .product-num{
          border: 1px solid #e3e3e3;
          display: flex;
          text-align: center;
          .num-btn{
            width: 24px;
            height: 20px;
            background: #f7f7f7;
            margin: 0 auto;
            position: relative;
            &::after{
              content: "";
              display: block; 
              margin:0 auto;
              background-repeat: no-repeat;
            }
          }
         
          .num-reduce::after {
             width: 24px;
            height: 20px;
             background: url("../../../../static/img/cart/jian.png") no-repeat center center;

                background-size: 28px;
          }
          .num-add::after{
            width: 24px;
            height: 20px;
            background: url("../../../../static/img/cart/jia.png")  no-repeat center center;
            background-size: 28px;
          }
          .num-input{
            width: 42px;
            line-height: 20px;
            border: none;
            text-align: center;
            display: inline-block;
            color: #dd2727;
          }
        }
      }
    }
    .invalid-item.goods-item {
      .titl {
        color: $grey;
      }
      .tips-lf {
        color: $grey;
        flex-shrink: 0;
        width: 30px;
        white-space: nowrap;
        overflow: hidden;
        margin-left: -7px;
        align-self: center;
        text-align: right;
      }
    }
  }
  .opera-wrap {
    height: pxToRem(100px);
    width: 100%;
    position: fixed;
    bottom: pxToRem(100px);
    left: 0;
    right: 0;
    height: pxToRem(100px);
    box-sizing: border-box;
    border-top: 1px solid #f5f5f5;
    background-color: #fff;
    z-index: 9999;
    display: flex;
    padding-left: pxToRem(30px);
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    .lf {
      display: flex;
      align-items: center;
      height: 100%;
      p {
        height: 100%;
        padding: pxToRem(30px);
        color: #353535;
      }
    }
    .rt {
      display: flex;
      height: 100%;
      align-items: center;
      p {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10px;
        margin-right: pxToRem(24px);
        span {
          color: #dd2727;
          font-size: 12px;
        }
      }
      .btn {
        width: pxToRem(270px);
        height: 100%;
        text-align: center;
        line-height: pxToRem(100px);
        color: #fff;
        background-color: #dd2727;
        font-size: 16px;
      }
    }
  }
  
}
.cart-empty-wrap {
    width: 50%;
    text-align: center;
    @include fixedCenter();
    p{
      @include tips();
    }
    span{
      text-align: center;
      display: inline-block;
      width: pxToRem(220px);
      height: pxToRem(62px);
      line-height: pxToRem(62px);
      font-size: pxToRem(34px);
      background:#31b3ff;
      color:#fff;
      border-radius: 5px;
    }
  }
</style>


