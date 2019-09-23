<template>
<div class="homeRule-wrap">
  <div class="homeRule-mask" :style="winStyle"></div>
  <div class="homeRule">
    <div id="homeRule-innner">
    <p class="homeRule-font1">根据国家工商总局 <i>《网络交易管理办法》</i> 要求平台营业执照信息。公式如下：</p>
    <div class="homeRule-box">
      <p>企业注册号：{{ruleForm.lic_no}}</p>
      <p>企业名称：{{ruleForm.company_name}}</p>
      <p>类型：有限责任公司 (非自然人投资或控股的法人独资)</p>
      <p>住所：{{ruleForm.lic_address}}</p>
      <p>法定代表人：{{ruleForm.rep_name}}</p>
      <p>成立时间：{{ruleForm.est_date}}</p>
      <p>注册资本：{{ruleForm.reg_capital}}</p>
      <p>营业期限：{{ruleForm.biz_term}}</p>
      <p>经营范围：{{ruleForm.biz_scope}}</p>
    </div>
    <p class="homeRule-fotterfont">注：以上营业执照信息来源于工商系统数据，具体以工商部门登记为准</p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      id: Number(this.$router.currentRoute.query.id),
      ruleForm: {
        lic_no: '', // 注册账号
        company_name: '', // 企业名称
        lic_address: '', // 住所
        rep_name: '', // 法定代表人
        est_date: '', // 成立时间
        reg_capital: '', // 注册资本
        biz_term: '', // 营业期限
        biz_scope: '' // 经营范围
      },
      winStyle:{}
    }
  },
  methods: {
    getData () {
      let id;
      id = this.id ? this.id : 0
      this.$axios.post('/wap/Merchant/getBusinessLicenseInfo', {m_id: id})
      .then(res => {
        let _data = res.data
        if (_data.code === 0) {
          this.$store.commit('setLoading', false)
          this.ruleForm = _data.data
        } else {
          this.$toast.error(`${_data.message}`)
        }
      })
    }
  },
  created () {
    this.getData()
  },
  mounted(){
    //更新蒙层高度
    setTimeout(()=>{
      this.winStyle={
      height:Math.max(window.innerHeight,document.getElementById("homeRule-innner").clientHeight)+"px"
    }
    },1000)
    
  }
}
</script>

<style lang="scss" scoped>
.homeRule-wrap{
  position: absolute;
  top:0;
  right: 0;
  left: 0;
  width: 100%;
  overflow-y:scroll;
  overflow-x: hidden;
  will-change: transform;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  background-color: #fff;
    -webkit-user-select: none;
  user-select: none;
}
.homeRule-mask{
    position: absolute;
    top:0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0);
    z-index: 9999;
    display: none;
  }
.homeRule{
  position: absolute;
  top:0;
  left: 0;
  
  width: auto;
  height: 100%;
  background-image: url('../../../../static/img/other/bus-bg.png');
  background-size: cover;
  padding: 12px 24px 12px 16px;
  
  .homeRule-font1{
    font-size: 14px;
    color: #202020;
    i{
      font-weight: bold;
    }
  }
  .homeRule-box{
    margin-top: 16px;
    p{
      color: #4D4D4D;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .homeRule-fotterfont{
    margin-top: 20px;
    font-size: 12px;
    color: #959595;
  }
}
</style>
