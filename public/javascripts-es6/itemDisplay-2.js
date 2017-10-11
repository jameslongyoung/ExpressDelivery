require("babel-polyfill")

window.onload=function () {
    let button=document.querySelector(".submit").innerHTML;
    if(button=="确认收货")
    {
        document.querySelectorAll(".key")[4].innerHTML="快递员电话";
        document.querySelectorAll(".key")[4].style.color="red";
        document.querySelectorAll(".value")[4].style.color="red";
    }
};

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
    confirm("确定要确认收货吗","",function (isConfirm) {
        if (isConfirm) {
            ajax("post","itemDisplay/confirm"+window.location.href.substr(window.location.href.indexOf("?")),{},function (responseText) {
                if(responseText=="ok")
                {
                    alert("订单","确认成功",function () {
                        window.history.go(-1);
                        window.location.reload();
                    },{type:"success"});

                }
                else{
                    alert("订单","确认失败",function () {

                    },{type:"error"});
                }
            })
        } else {
            return ;
        }
    });
});