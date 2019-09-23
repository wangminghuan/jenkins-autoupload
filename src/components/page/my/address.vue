   <!-- 我的地址管理 -->
<template>
 <div class="my-address-wrap">
     <ul>
         <li class="address-box" v-for="(item,index) in list" :key="index" @click="handleSelect(item)">
            <div class="top">
                <span class="name">{{typeof item.name=="string" && item.name.length>7?item.name.substring(0,7)+'...':item.name}}</span>
                <i class="phone">{{item.phone}}</i>
            </div>
            <div :class="['center',{'center-min':isInSelectId}]">{{item.province_name+item.city_name+item.area_name+item.address}}</div>
            <div class="bottom" v-if="!isInSelectId">
                <div class="left" @click="handleSetDefault(index,item)">
                    <span :class="['common-checkbox-icon',item.is_default?'checked':'']" ><i></i></span>
                    <b>设为默认</b>
                </div>
                <div class="right">
                    <span @click="editAddress(item.a_id)">编辑</span>
                    <i @click="delAddress(index)">删除</i>
                </div>
            </div>
            <div class="select-icon" v-if="isInSelectId">
               <span :class="['common-checkbox-icon',{'checked':item.selected}]"><i></i></span>
            </div>
         </li>
     </ul>
     <div v-if="noAddress" class="no-address"><img src="../../../../static/img/my/no-address.png"><p>暂无收货地址</p></div>
     <div class="new-address" @click="jumpNewAddress()">+新建地址</div>
 </div>
</template>
<script>
export default {
  data() {
    return {
      isInSelectId:this.$route.query.aid||"",//是否处于选择模式
      list: [],
      noAddress:false,
    };
  },
  methods: {
    handleSelect(item){
      if(this.isInSelectId){
         this.$store.commit("setAddress",{
              a_id:item.a_id,
              address:item.province_name+item.city_name+item.area_name+item.address,
              name:item.name,
              phone:item.phone,
          })
        window.history.go(-1)
      }
    },
    //   获取地址信息
    getAddressList() {
      this.$axios.post("/wap/Address/lists").then(res => {
        const _data = res.data;
        if(_data.code==0){
            let list = _data.data&& _data.data.data instanceof Array ? _data.data.data : [];
            this.isInSelectId && list.map((item)=>{
               item.selected=this.isInSelectId==item.a_id?1:0
            })
            this.list =list;
            this.noAddress=(this.list.length==0)?true:false;
        }
        this.$store.commit("setLoading", false);
      });
    },
    //   编辑当前地址
    editAddress(id) {
        this.$router.push({path:'/index/my_new_address',query:{id:id}})
    },
    //   删除当前地址
    delAddress(index) {
        //未加确认是否删除
        if(this.list[index].is_default){
          this.$toast.error("默认地址无法删除")
          return
        }
        this.$dialog("确认删除？",()=>{
          this.$store.commit("setLoading", true);
          this.$axios.post("/wap/Address/delete",{
            a_id:this.list[index].a_id
          }).then((res)=>{
              const _data=res.data;
              if(_data.code==0){
                this.list.splice(index,1)
              }
              this.$store.commit("setLoading", false);
          })
          
        })
    },
    //   跳转新建地址
    jumpNewAddress() {
        this.$router.push({path:'/index/my_new_address'})
    },
    // 修改默认
    handleSetDefault(inx,item){
      if(item.is_default) return;
      this.$store.commit("setLoading", true);
      this.$axios.post("/wap/Address/setDefault",{
        a_id:this.list[inx].a_id
      }).then((res)=>{
          const _data=res.data;
          if(_data.code==0){
            this.$toast.success("设置成功")
            this.list.map((item,index)=>{
            inx==index?item.is_default=1:item.is_default=0;
          })
          }
          this.$store.commit("setLoading", false);
      })
        
    },
  },
  //放在激活生命周期内，防止缓存不更新
  activated(){
     this.getAddressList()
  },
};
</script>

<style lang="scss">
@import "static/css/mixin.scss";
.my-address-wrap {
  padding-bottom:pxToRem(100px); 
  .no-address {
    // display: block;
    width: 40%;
    @include fixedCenter();
    p{
      @include tips();
    }
  }
  .address-box {
    background: #fff;
    padding-top: pxToRem(24px);
    margin-bottom: pxToRem(24px);
    position: relative;
    .top {
      font-size: 16px;
      font-weight: 700;
      padding: 0 pxToRem(24px);
      span {
        margin-right: pxToRem(30px);
      }
      i {
        font-weight: 700;
      }
    }
    .center {
      color: #959595;
      padding: pxToRem(20px) pxToRem(24px);
      border-bottom: 1px solid #f8f8f8;
    }
    .center-min{
      width:90%; 
    }
    .bottom {
      padding: 0 pxToRem(24px);
      display: flex;
      justify-content: space-between;
      line-height: pxToRem(84px);
      align-items: center;
      .left{
          height: pxToRem(88px);
          display: flex;
          align-items: center;
          .common-checkbox-icon{
            margin-right: 8px;
            transform: scale(.8)
          }
          .common-checkbox-icon.checked {
          i {
            width: 5px;
            height: 10px;
          }
        }
      }
      .right {
        text-align: right;
        display: flex;
        align-items: center;
        color: #959595;
        span,i{
          @include backgroundImage(0,center,18px,18px);
          padding-left: 22px;
          line-height: 22px;
          display: inline-block;
        }
        span {
          margin-right: pxToRem(30px);
          background-image: url("../../../../static/img/my/edit-icon.png");
        }
        i{
          background-image: url("../../../../static/img/my/del-icon.png");
        }
      }
    }
    .select-icon{
      position: absolute;
      right: pxToRem(24px);
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .new-address {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #dd2727;
    color: #fff;
    font-size: 17px;
    text-align: center;
    line-height: pxToRem(100px);
    z-index: 999;
  }
}
</style>

