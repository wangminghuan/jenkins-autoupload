
<!--空白页，跳转到IM  -->
<template>

</template>
<script>
export default {
    created(){
      const token=this.getCookie("__m_token__");
      window.location.replace("//"+(window.location.port?"s29.dev.bxd365.com":"s29.9956.cn")+"/res/common/im_v1/wap.html?wap_token="+token+"&m_id=-1");
    }
}
</script>

