import type from "./source";
//需要授权的浏览器
const _ua=window.navigator.userAgent.toLowerCase();
// 0安卓，1ios
const isIos=_ua.match("iphone")?1:0;
//1助手 2保世界 3H5

let phone="";
//助手下获取手机号
if(type==1){
  if(typeof CustomJS!=="undefined" && CustomJS.getUserInfo){
    try {
      const userinfo=JSON.parse(CustomJS.getUserInfo())
      phone=  userinfo.data && userinfo.data.phone? userinfo.data.phone:"";
    } catch (error) {
      phone=""
    } 
    if(phone==""){
      window.zhuShouCallback = function () {
        window.location.reload()
       };
       isIos ? CustomJS.showActivity('BXPhoneLoginViewController', '') : CustomJS.showActivity('LoginActivity', '');
    }
  
  }
  
}else if(type==2){
  //保世界下获取手机号
  if(typeof CustomJS!=="undefined" && CustomJS.getUser){
    try {
      const userinfo=JSON.parse(CustomJS.getUser())
      phone=userinfo.u_phone||""
    } catch (error) {
       phone=""
    } 
  }
}
export default phone;