const _ua=window.navigator.userAgent.toLowerCase();

//1助手 2保世界 3H5 4 微信
const type=_ua.match("zhushou browser")?1:_ua.match("zhongchuang")?2:_ua.match("micromessenger")?4:3;
export default type;