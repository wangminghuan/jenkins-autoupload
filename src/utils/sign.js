import Md5 from "md5";
const  finalhost=window.location.port?"api.newgiftmall.com:8001":"api.newgiftmall.com";
//对字符串进行加密, 通过解密函数得到结果 
// function compileStr(code){         
//     let c=String.fromCharCode(code.charCodeAt(0)+code.length); 
//     for(let i=1;i<code.length;i++){        
//       c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
//     }     
//     return escape(c);   
//  } 
const  secret_arr=[
    "R%94%95%95%97lnm%9E%97%97%C7%95%96%C5%C4%91%96%97%93%98%97%97f%92%92%93%C9%9B%97%C4%C7%9Em",
    "Z%99%96fg%9C%9B%9B%96%94%95%95%97lnf%97%C9%C4%C3%C4%C7%C6%95%96%9Bi%93%97d%92%C4%92f",
    "S%97%99lnf%97%C7%99%9E%96%94%95%95%98d%92%98%97%97%9C%9B%97%C4%C7%9Ei%92%92%93%97%96%C5%C4",
    "R%93%94%95%9Ajifi%9E%96%94%C9%D7%A6%99%CC%9Foo%9A%C5%C4%91%92%92%93%97hj%9C%9B%97%C7",
    "%88%9Al%9E%96%94%95%95%97lnf%97%C7%95%96%C5%C4%91%92%98%97%97%9C%9B%97%C4%C7%9Ei%92%92%93%97",//"f48f0d1d3951fa4bca0b6a6f5bbe90b0c4",//真正的key,去掉前面两位
    "Z%9E%CC%96efi%9E%C7%C2%C5%95%97%9B%97%C4%C7%C9%97lid%96%C5%C5%C4%98oidd%93%99%97"
];
// 将字符串转义编码
const uncompileStr=function(code){        
    code=unescape(code);        
    let c=String.fromCharCode(code.charCodeAt(0)-code.length);        
    for(var i=1;i<code.length;i++){        
     c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
    }        
    return c;   
}  
var getMd5Code=function(url,allParams){
    var strParams=decodeURIComponent(((allParams.split("&")).sort()).join("&"));
    let _str= ((finalhost+url+"?")+strParams) + (''== null? uncompileStr(secret_arr[2]).substring(2):
    false == ''? uncompileStr(secret_arr[1]).substring(3) && NaN===NaN?null == undefined?uncompileStr(secret_arr[5]).substring(1):uncompileStr(secret_arr[3]).substring(1):uncompileStr(secret_arr[4]).substring(2):uncompileStr(secret_arr[0]).substring(1))
    return {
        md5:Md5(_str),
        web:_str
    } 
}
export default  getMd5Code