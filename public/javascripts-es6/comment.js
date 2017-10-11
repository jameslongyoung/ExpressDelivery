require("babel-polyfill")

var star=-1;
document.getElementById("star1").addEventListener("click",function () {
    star=1;
    document.querySelector("#comment").innerHTML="\"很差\"";
});
document.getElementById("star2").addEventListener("click",function () {
    star=2;
    document.querySelector("#comment").innerHTML="\"一般\"";
});
document.getElementById("star3").addEventListener("click",function () {
    star=3;
    document.querySelector("#comment").innerHTML="\"满意\"";
});
document.getElementById("star4").addEventListener("click",function () {
    star=4;
    document.querySelector("#comment").innerHTML="\"非常满意\"";
});
document.getElementById("star5").addEventListener("click",function () {
    star=5;
    document.querySelector("#comment").innerHTML="\"无可挑剔\"";
});
document.getElementById("comment__button").addEventListener("click",function () {
    if(star==-1)
    {
        alert("请为快递员的服务打分");
        return;
    }
    else if(document.getElementById("comment__textarea").value.length>50)
    {
        alert("评论不能多于50字");
    }
    let comment={id:"",content:document.getElementById("comment__textarea").value,star:star};
    ajax("post","/comment/submit"+location.search,JSON.stringify(comment),function (responseText) {
        console.log(responseText);
        if(responseText=="no auth")
        {
            alert("评价","您无权限评论");
        }
        else if(responseText=="internal error")
        {
            alert("错误","服务器内部错误",function () {

            },{type:"error"});
        }
        else if(responseText=="error"){
            alert("错误");
        }
        else if(responseText=="ok") {
            alert("评价","评论成功",function () {
                window.history.go(-1);
            },{type:"success"});

        }
        else if(responseText=="already comment")
        {
            alert("评价","已经评论过了，不能评论");
        }
        else
        {
            alert("错误","服务器无响应",function () {

            },{type:"error"});
        }
    });
});
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
    };
    xmlhttprequest.timeout=10000;
    xmlhttprequest.ontimeout=function () {
        callback("err");
    }
};