require("babel-polyfill")

function ajax(method,url,data,callback) {
    var xmlhttprequest=new XMLHttpRequest();
    xmlhttprequest.open(method,url,true);
    xmlhttprequest.send(data);
    xmlhttprequest.onreadystatechange=function()
    {
        if (xmlhttprequest.readyState==4 && xmlhttprequest.status==200)
        {
            callback(xmlhttprequest.responseText);
        }
    }
    xmlhttprequest.timeout=10000;
    xmlhttprequest.ontimeout=function () {
        callback("err");
    }
}
let orderButton=document.getElementsByClassName("submit")[0]
orderButton.addEventListener("click",function () {
    "use strict";
    ajax("post","/itemDisplay/cancel"+window.location.search,{},function (responseText) {
        if(responseText=="error")
        {
            alert("订单","取消失败",function () {

            },{type:"error"});
        }
        else
        {
            alert("订单","取消成功",function () {

            },{type:"success"});
            window.location.href="/orderManagement"+window.location.search.substring(0,window.location.search.lastIndexOf("&"));
        }
    })

});