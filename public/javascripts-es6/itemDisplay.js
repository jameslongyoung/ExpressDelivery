require("babel-polyfill")

let value=document.getElementsByClassName("value");
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
for(let i=0;i<value.length;i++)
{
    value[i].style.width=document.body.clientWidth*0.9*0.7-3+"px";
}
let orderButton=document.getElementsByClassName("submit")[0]
orderButton.addEventListener("click",function () {
    orderButton.disabled=true;
    ajax("post","/itemDisplay/order"+window.location.href.substr(window.location.href.indexOf("?")),{},function (text) {
        "use strict";
        console.log(text);
        if(text=="error")
        {
            alert("订单","服务器错误，修改失败",function () {

            },{type:"error"});
        }
        else if(text=="no auth")
        {
            alert("订单","您无权限访问这个页面",function () {
            });
        }
        else if(text=="order failed")
        {
            alert("订单","您手慢了");
        }
        else if(text=="success")
        {
            alert("订单","抢单成功",function () {
                location.href="index"+location.href.substring(location.href.indexOf("?"),location.href.lastIndexOf("&"));
            },{type:"success"});

        }
        else
        {
            alert("订单","不能抢自己的订单");
        }
    })

});