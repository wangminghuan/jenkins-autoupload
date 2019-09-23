   <!-- 我的地址管理 -->
<template>
 <div class="my-new-address-wrap">
     <ul >
         <li class="address-box item">
             <div class="left">收货人</div>
             <div class="right">
               <input type="text" v-model="renderData.name" placeholder="请输入姓名">
             </div>
         </li>
         <li class="address-box item">
             <div class="left">联系方式</div>
             <div class="right">
               <input type="tel" v-model="renderData.phone" @focus="holder=''" @blur="holder='请输入联系方式'" @input="handleInput" :placeholder="holder">
             </div>
         </li>
         <li class="address-box item">
             <div class="left">所在地区</div>
             <div class="right" @click="showCity=true"><span v-if="cityName">{{cityName}}</span><span v-else style="color:#555">请选择所在地区</span></div>
         </li>
         <li class="address-box item">
             <div class="left">详细地址</div>
             <div class="right">
               <input type="text" v-model="renderData.address" placeholder="请输入详细地址">
             </div>
         </li>
         <li class="address-box">
             <div class="left">设为默认地址</div>
              <input type="checkbox" v-model="isDefault" :class="['my-switch',isDefault?'checked':'']">
         </li>
     </ul>
     <div class="save" @click="saveAddress()">保存并使用</div>
     <citySelect
            v-if="renderCity"
            v-model="showCity"
            ref="cityselectDemo"
            :callback="selectCityCallback"
            :provance="renderData.province_name"
            :city="renderData.city_name"
            :area="renderData.area_name"
        ></citySelect>
 </div>
</template>
<script>
import citySelect from "../../common/citySelect";
export default {
  components: {
    citySelect
  },
  data() {
    return {
      showCity: false,
      renderCity:false,//初始不渲染组件，解决初始不回填的问题
      id: this.$route.query.id, //传输过来的编辑的条数id,
      isEdit: this.$route.query.id ? true : false,
      isDefault: false,
      holder:'请输入联系方式',
      renderData: {
        area_name:"",
        city_name:"",
        province_name:"",
        name:"",
        phone:"",
        address:""
      },
      cityCode:{}
    };
  },
  computed:{
     cityName(){
       return this.renderData.province_name+this.renderData.city_name+this.renderData.area_name;
     }
  },
  methods: {
    handleInput(e){
      this.renderData.phone=e.target.value.replace(/\D+/g,'')
    },
    // hjp  屏蔽掉表情
    // handleInput(e){
    //   this.renderData.address=e.target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\._ ]/g,'')
    // },
    selectCityCallback(val) {
      this.renderData.province_name = val.itemName1||"";
      this.renderData.city_name=val.itemName2||"";
      this.renderData.area_name=val.itemName3||"";
      this.cityCode={
        province:val.itemValue1||"",
        city:val.itemValue2||"",
        area:val.itemValue3||""
      }
    },
    //   获取地址信息
    getAddressDetail() {
      this.$axios
        .post("/wap/Address/get", {
          a_id: this.id
        })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            this.renderData = _data.data || {};
            this.isDefault=this.renderData.is_default==1?true:false;
            this.cityCode={
              province:this.renderData.province||"",
              city:this.renderData.city||"",
              area:this.renderData.area||""
            }
            this.renderCity=true;
          }
          this.$store.commit("setLoading", false);
        });
    },
    checkPhoneNumber(){
    if(!(/^1[3456789]\d{9}$/.test(this.renderData.phone))){
          this.$toast.error("请输入正确的联系方式！")
          return false;
    }
     return true;
   },
    //   跳转新建地址
    saveAddress() {
      const name=this.renderData.name.replace(/\s+/,'');
      const address=this.renderData.address.replace(/\s+/,'');
      //校验输入
      if(!name){
          this.$toast.error("请填写收货人姓名")
          return;
      }
      if(!this.checkPhoneNumber()){
          return;
      }
      if(!this.cityCode.province || !this.cityCode.city){
         this.$toast.error("请选择所在地区")
          return;
      }
      if(!address){
         this.$toast.error("请填写详细地址")
          return;
      }
      //校验结束
      this.$store.commit("setLoading", true);
      const obj={
        name:name,
        phone:this.renderData.phone,
        address:address,
        is_default:this.isDefault?1:0,
        ...this.cityCode
      }
      if(this.isEdit) obj.a_id=this.renderData.a_id;
      this.$axios.post(this.isEdit?"/wap/Address/update":"/wap/Address/add",obj).then((res)=>{
          const _data=res.data;
          if(_data.code==0){
            this.$toast.success(this.isEdit?"修改成功":"添加成功")
            setTimeout(()=>{
                 window.history.go(-1)
            },1000)
          }
          this.$store.commit("setLoading", false);
      })
    }
  },
  created() {
    if(this.isEdit){
        this.getAddressDetail()
    }else{
      this.$store.commit("setLoading", false);
      this.renderCity=true;
    }
  }
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";

.my-new-address-wrap {
  padding-top: pxToRem(32px);
  height: 100%;
  background-attachment: #f8f8f8;
  .address-box {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding: 0 pxToRem(24px);
    line-height: pxToRem(90px);
    height: pxToRem(90px);
    background: #fff;
    border-bottom: 1px solid #f8f8f8;
    position: relative;
    align-items: center;
    &.item .right {
      flex: 1;
      text-align: right;
      color: #000;
      height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      input {
        text-align: right;
        // height: 18px;
        // line-height: 18px;
        height: 30px;
        line-height: 30px;
      }
      input,
      textarea {
        width: pxToRem(400px);
      }
    }
    .my-switch {
      position: relative;
      z-index: 10;
      display: block;
      width: 42px;
      height: 22px;
      left: 0;
      border: 1px solid #dfdfdf;
      border-radius: 16px;
      background-color: #dfdfdf;
      -webkit-appearance: none;
      color: rgb(221, 39, 39);
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        border-radius: 10px;
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
      }
      &::after {
        transform: translateX(0px);
        width: 20px;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      }
      &.checked{
        background-color: rgb(221, 39, 39);
         &::after {
          transform: translateX(20px);
        }
      }
    }
    // .yd-switch{
    //       width: 40px;
    //      height: 22px;
    //      &::before,&::after{
    //        width: 20px!important;
    //        height: 20px!important;
    //        border-radius: 50%!important;
    //      }
    // }
  }
  .save {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #dd2727;
    color: #fff;
    font-size: 17px;
    text-align: center;
    line-height: pxToRem(100px);
  }
}
</style>

