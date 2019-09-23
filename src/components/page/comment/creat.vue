<template>
<!-- 发表评论 -->
<!-- 评论结果 -->
  <div v-if="isCommentSuccess" class="comment-result-wrap">
    <img src="../../../../static/img/comment/success.png">
    <p>感谢您的用心评价！</p>
    <span>您的评价将帮助更多人~</span>
    <i>{{leftTime}}s后跳转到我的订单页面</i>
    <div class="jump" @click="handleJumpHome">去购物</div>
  </div>
  <!-- 评论添加 -->
  <div class="comment-creat-wrap" v-else>
    <div class="inner-wrap" :style="myStyle">
     <ul class="cont">
       <li class="items" v-for="(item, index) in list" :key="index">
         <section class="top">
           <div class="t-lf"><img v-lazy="item.g_image"></div>
           <div class="t-rt">
             <em>商品评分</em>
             <myRate v-model="item.ogj_star"></myRate>
           </div>
         </section>
         <section class="btm">
            <textarea placeholder="好评！" rows="5" v-model.trim="item.ogj_context" :maxlength="maxLength"></textarea>
            <i>{{item.ogj_context.length+'/'+maxLength}}</i>
         </section>
        <section class="img">
          <p class="load" v-for="(simg,sindex) in item.ogj_image" :key="sindex"><section class="img-wrap"><img :src="simg+ '?x-oss-process=image/resize,m_fill,h_400,w_400'" @click="handleShowPreview(sindex,index)"></section><i class="close" @click.stop="handleDelectPic(index,sindex)"></i></p>
          <p class="add" v-if="item.ogj_image.length<9">
            <input type="file" accept="image/*" style="opacity:0" @change="(e)=>imgSelectChange(e,index)">
          </p>
        </section>
        <section class="un-name" ><em @click="handleSet(item)"><span  :class="['common-checkbox-icon',item.ogj_is_anonymous==1?'checked':'']"><i></i></span><b>我要匿名</b></em></section>
       </li>
     </ul>
     <div class="shop-comment">
       <span>商家服务</span>
       <myRate v-model="form.mj_star"></myRate>
     </div>
    </div>
     <div class="submit-btn" @click="handleSubmit" v-show="isShowBtn">
       <span>提交</span>
     </div>
     <myDialog v-model="isShowDialog" :handleCallBack="handleCallBack"></myDialog>
     <!-- 预览模块 -->
     <div class="preview-box" v-if="isShowPreview">
        <div class="head"><span>{{(previewIndex+1)+"/"+imgArr.length}}</span><p class="close" @click.stop="isShowPreview=false">关闭</p></div>
        <yd-slider :index="initIndex" :callback="previewCallback" :show-pagination="false">
                <yd-slider-item v-for="(item,index) in imgArr" :key="index">
                      <img :src="item">
                </yd-slider-item>
          </yd-slider>
          </div>
          <!-- 评论成功页面 -->
  </div>
</template>
<script>
import myRate from "./rate"
import myDialog from "./dialog";
import {cookie} from "../../../utils/utils.js";
import Vue from "vue";
import { Slider, SliderItem } from "vue-ydui/dist/lib.px/slider";
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);
export default {
  components:{
    myRate,
    myDialog
  },
  data(){
    return {
      osnArr:(sessionStorage.getItem("___hascomment__")||"").split(","),//已提交的osn，防止用户刷新页面重新提交
      draftData:JSON.parse(localStorage.getItem("__comment_draft__")||"{}"), //草稿箱数据
      timer:null,
      leftTime:5,//5s后自动跳转
      isCommentSuccess:false,//评论提价成功
      previewIndex: 1, //预览图上的索引
      initIndex: 1, //预览图初始化时的索引，不可与上面的索引公用，会有问题
      isShowPreview: false, //是否展示预览图模式
      imgArr: [],//预览图片库
      isShowDialog:false,
      o_id:this.$route.query.oid||"",
      form:{
        mj_star:"5",
        m_id:"",
        o_sn:this.$route.query.osn||"",
      },
      list:[],
      hasSave:false,//是否保存
      maxLength:500,
      myStyle:{},
      winHeight:window.innerHeight,//屏幕高度
      isShowBtn:true,
    }
  },
  methods:{
    handleJumpHome(){
      clearInterval(this.timer);
     this.$router.push("/index/home")
    },
    //初始化评论结果页面
    initResult(){
      this.isCommentSuccess=true;
      this.hasSave=true;
      clearInterval(this.timer)
      this.timer=setInterval(()=>{
          this.leftTime--;
          if(this.leftTime==0){
            window.history.go(-1)
          }
      },1000);
      this.$store.commit("setLoading", false);
    },
    //删除草稿箱数据 当用户不保存或再次提交成功时候
    delDraft(){
        delete this.draftData[this.form.o_sn];
        localStorage.setItem("__comment_draft__",JSON.stringify(this.draftData));
    },
    //展示大图预览
    handleShowPreview(inx,i) {
      const _arr=this.list[i] && this.list[i].ogj_image instanceof Array ?this.list[i].ogj_image:[];
      if(_arr.length==0) return;
      this.imgArr= _arr;
      this.initIndex = inx;
      this.previewIndex = inx;
      this.isShowPreview = true;
    },
    //预览回调
    previewCallback(val) {
      this.previewIndex = val;
    },
    handleDelectPic(index,sindex){
        this.$dialog("确定删除该图片？",()=>{
          this.list[index].ogj_image.splice(sindex,1);
        },"提示")
    },
    //提交评价
    handleSubmit(){
      this.$store.commit("setLoading", true);
      //重新组装数据
      // this.form.goods_judge=JSON.stringify(this.list);
      const _judge=JSON.parse(JSON.stringify(this.list));
      _judge.map((item)=>{
        //无有效评论 则填充为好评
          if(item.ogj_context.replace(/s+[\r\n]/g,"")=="") item.ogj_context="好评！"
      })
      this.$axios.post("/wap/Judge/addJudge",{
      ...this.form,
       goods_judge:JSON.stringify(_judge)
      })
      .then((res)=>{
        const _data=res.data;
        if(_data.code==0){
           this.osnArr.push(this.form.o_sn);
           sessionStorage.setItem("___hascomment__",this.osnArr.join(","));//存储已经评论的osn
           this.delDraft();//删除草稿
           this.initResult();
        }else{
          this.$store.commit("setLoading", false);
          this.$toast.error(_data.message)
        }
      })
    },
    //草稿确定回调
    handleCallBack(type){
      if(type==0){
        //取消
        this.delDraft();
        this.hasSave=true;
        window.history.go(-1);
      }else if(type==1){
        //保存
        this.draftData[this.form.o_sn]={
          ...this.form,
          goods_judge:this.list
        };
        localStorage.setItem("__comment_draft__",JSON.stringify(this.draftData));
        this.hasSave=true;
        window.history.go(-1);
      }
    },
    //设置是否匿名
    handleSet(item){
      item.ogj_is_anonymous=(item.ogj_is_anonymous==1?0:1);
    },
    //上传图片
    imgSelectChange(e,_index){
        const fileInput = e.target
        
        if (fileInput.files.length == 0) {
          return
        }
        if(fileInput.files.length >1){
              this.$toast.error('一次只能选择一张！')
              return
        }
        if (fileInput.files[0].size > 1024 * 1024 * 2) {
            this.$toast.error('图片不能大于2M')
            return;
        }
        const formdata = new FormData();
        formdata.append("file", fileInput.files[0]);
        this.$store.commit("setLoading", true);
        this.$axios.post("/wap/Upload/upload",formdata)
        .then((res)=>{
          const _data=res.data;
          if(_data.code==0){
              const imgUrl=(_data.data.url||"").replace(/^http:/,'');
              this.list[_index].ogj_image.push(imgUrl);
          }else{
             this.$toast.error(_data.message)
          }
          this.$store.commit("setLoading", false);
        })
    },
    getData(){
      if(this.draftData[this.form.o_sn]){
        //草稿回填
        this.form.mj_star=this.draftData[this.form.o_sn].mj_star;
        this.form.m_id=this.draftData[this.form.o_sn].m_id;
        this.list=this.draftData[this.form.o_sn].goods_judge;
        this.$store.commit("setLoading", false);
        return;
      }
      this.$axios.post("/wap/Order/getDetail",{
        o_id:this.o_id
      })
      .then((res)=>{
        const _data=res.data;
        if(_data.code==0){
         this.form.m_id=_data.data.shop_name?_data.data.m_id:"0";
         const _list= _data.data.order_goods||[];
         _list.map((item)=>{
               item.ogj_star="5";
               item.ogj_context="";
               item.ogj_is_anonymous="1";
               item.ogj_image=[];
               item.g_image= typeof item.g_images =="string"?(item.g_images.split(",")[0]||""):"";
         })
         this.list=_list;
        }
        this.$store.commit("setLoading", false);
      })
    },
    resizeCallback(){
        if(window.innerHeight<this.winHeight){
          this.isShowBtn=false
        }else{
          this.isShowBtn=true
        }
    },

  },
  created(){
    //如果已经评论过，则修改评论状态，防止用户重复提交
    if(this.osnArr.indexOf(this.form.o_sn)>-1){
        this.initResult();
    }else{
      this.getData();
    }
    //保世界 andriod 和ios 上传会执行一个回调 ,防止报错，定义一个
    window.refreshPage=()=>{};
    window.zhuShouCallback=()=>{}
    
  },
  mounted(){
    window.addEventListener("resize", this.resizeCallback);
    this.myStyle={
        height:window.innerHeight-document.querySelector(".submit-btn").clientHeight-10+'px'
    }
  },
   destroyed() {
    window.removeEventListener("resize", this.resizeCallback);
  },

  //路由离开守卫
  beforeRouteLeave(to, from, next) {
    if(this.hasSave){
      this.isShowDialog=false;
      this.hasSave=false;
        next()
    }else{
      this.isShowDialog=true;
      next(false)
    }
  },
}
</script>
<style lang="scss">
@import "static/css/mixin.scss";
.comment-result-wrap{
  width: pxToRem(522px);
  margin:0 auto;
  position: absolute;
  top:40%;
  transform: translateY(-50%);
  left:0;
  right: 0;
   img{
     width: pxToRem(222px);
     height: pxToRem(130px);
     display: block;
     margin:0 auto;
     margin-bottom: pxToRem(48px);
   }
   p{
    font-size:18px;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:42px;
    text-align: center;
   }
   span{
     font-size:14px;
    font-weight:500;
    display: block;
    text-align: center;
    color:rgba(85,85,85,1);
   }
   i{
    display: block;
    text-align: center;
    font-size:12px;
    font-weight:500;
    color:rgba(149,149,149,1);
    margin-bottom: pxToRem(90px);
    margin-top: pxToRem(53px);
   }
   .jump{
      width:100%;
      height:pxToRem(84px);
      background:linear-gradient(135deg,rgba(221,24,16,1) 0%,rgba(219,29,29,1) 100%);
      box-shadow:0px 1px 2px 0px rgba(219,30,32,0.2);
      border-radius:pxToRem(42px);
      text-align: center;
      line-height:pxToRem(84px);
      font-size:16px;
      font-weight:500;
      color:rgba(255,255,255,1);
   }
}
.comment-creat-wrap{
  position: absolute;
  top:0;
  height:100%;
  width: 100%;
  left: 0;
  
  .inner-wrap{
     position: absolute;
  top:0;
  height:100%;
  width: 100%;
  left: 0;
  overflow: scroll;
  }
  .preview-box {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 1);
  .head {
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    p {
      position: absolute;
      right: 0;
      top: 0;
      right: 10px;
    }
  }
  .yd-slider {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    overflow: scroll;
    will-change: transform;
    -webkit-overflow-scrolling: touch;
  }
}
  .items{
    background-color: #fff;
    padding:0 pxToRem(24px);
    margin-bottom: pxToRem(20px);
    .top{
      display: flex;
      align-items: center;
      height: pxToRem(208px);
    }
    .btm{
      background-color: #F8F8F8;
      position: relative;
      padding-bottom:  pxToRem(60px);
      padding-top:  pxToRem(24px);
      textarea{
        background-color: #F8F8F8;
        display: block;
        width: 100%;
        padding: 0 pxToRem(24px);
        font-size: 15px;
      }
      i{
        position: absolute;
        right: pxToRem(24px);
        bottom:pxToRem(20px);
        font-size: 12px;
        color:#939393; 
      }
    }
    .img{
      display: flex;
      flex-wrap: wrap;
      margin:pxToRem(43px) 0 pxToRem(22px) 0;
      p{
        width: pxToRem(130px);
        height: pxToRem(130px);
        border-radius: 2px;
        margin-right:pxToRem(10px);
        position: relative;
        margin-bottom: pxToRem(10px);
        
      }
      p.load{
        .img-wrap{
          width: pxToRem(130px);
          height: pxToRem(130px);
          overflow: hidden;
          position: relative;
        }
          img{
              @include imgCenter();
              
          }
          // img[lazy=loaded]{
          //     width: pxToRem(130px);
          //     height: pxToRem(130px);
          // }
      }
      .close{
        position: absolute;
        right: 0;
        top:0;
        width:pxToRem(40px);
        height:pxToRem(40px);  
        background-image: url("../../../../static/img/comment/close.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translate3d(30%, -36%, 0);
      }
      p.add{
        background-image: url("../../../../static/img/comment/add.png");
        background-repeat: no-repeat;
        background-size: pxToRem(60px) pxToRem(60px);
        background-position: center;
        border:1px solid #EDEDED;
        margin-right:0;
        input{
         width: pxToRem(130px);
         height: pxToRem(130px);
        }
      }
    }
    .un-name{
      padding-bottom: pxToRem(24px);
      display: flex;
        align-items: center;
      em{
         display: flex;
      }
      b{
        margin-left:pxToRem(16px);
        align-self: center;
      }
    }
    .t-lf{
      position: relative;
      width: pxToRem(160px);
      height: pxToRem(160px);
      margin-right: pxToRem(24px);
      background-color:#f5f5f5;
      img{
          @include imgCenter()
      }
    }
    .t-rt{
      em{
        font-size: 15px;
        color:#1E1E1E;
        font-weight: bold;
        }
    }
  }
  .shop-comment{
    height: pxToRem(88px);
    width: 100%;
    background-color: #fff;
    padding: 0 pxToRem(24px);
    margin:pxToRem(20px) 0;
    display: flex;
    align-items: center;
    span{
      font-size:15px;
      font-weight:bold;
      color:rgba(30,30,30,1);
      margin-right: pxToRem(24px);
    }
  }
  .submit-btn{
    z-index: 100;
    background-color: #fff;
    height: pxToRem(120px);
    width: 100%;
    position: absolute;
    bottom: 0;
    span{
      height: pxToRem(100px);
       width: pxToRem(690px);
       position: absolute;
       left: 0;
       right: 0;
       margin: 0 auto;
       top:50%;
       transform: translateY(-50%);
       border-radius:  pxToRem(100px);
       text-align: center;
       line-height: pxToRem(100px);
       font-size:18px;
       color: #fff;
       font-weight:500;
       background-color:#DD2727; 
    }
  }
}
</style>
