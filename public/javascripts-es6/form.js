require("babel-polyfill");
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
document.querySelector(".buttonclass").addEventListener("click",function () {
    let time=document.getElementById("time").value;
    time=time.substring(0,10)+" | "+time.substring(11);
    console.log(time);
    let index=document.getElementById("express").selectedIndex;
    let express=document.getElementById("express").options[index].value;
    let name=document.getElementById("name").value;
    let from=document.getElementById("from").value;
    let to=document.getElementById("to").value;
    let salary=document.getElementById("salary").value;
    if(isNaN(parseInt(salary)))
    {
        alert("订单","报酬请输入数字");
        return ;
    }
    let note=document.getElementById("note").value;
    if(note.length>50)
    {
        alert("订单","备注不能超过50字");
        return ;
    }
    let expressObj={time:time,name:express+"-"+name,from:from,to:to,closed:false,is_order:false,salary:salary+"元",note:note,user:null,phone:"",creator:""};
    ajax("post","/form/submit"+window.location.href.substr(window.location.href.indexOf("?")),JSON.stringify(expressObj),function (responseText) {
            if(responseText=="no auth")
            {
                alert("错误","您没有权限",function () {
                    window.location.href="/";
                });

            }
            else if(responseText=="error")
            {
                alert("错误","服务器错误",function () {

                },{type:"error"});
            }
            else
            {
                alert("订单","发布成功",function () {
                    window.history.go(-1);
                    location.reload();
                },{type:"success"});

            }
    })
});