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
var captchaButton=document.getElementById("getCaptcha");
function timer() {
    captchaButton.innerHTML=captchaButton.innerHTML-1;
    if(captchaButton.innerHTML==0)
    {
        clearInterval(timer1);
        captchaButton.innerHTML="获取验证码";
        captchaButton.disabled=false;
    }
}
var timer1=null;
captchaButton.addEventListener("click",function () {
    let phoneNum=document.getElementById("tel").value;
    if(!(/^1[34578]\d{9}$/.test(phoneNum))){
        alert("验证","请输入正确的手机号");
        return ;
    }
    else {
        ajax("post","/telVerify/captcha",JSON.stringify({phone:document.getElementById("tel").value,url:window.location.href}),function (reply) {
            if(reply=="error")
            {
                alert("验证","信息发送失败");
            }
            else if(reply=="tel exists")
            {
                alert("验证","电话号码已经被注册");
            }
            else if(reply=="id exists")
            {
                alert("验证","用户名已经被注册");
            }
            else {
                alert("验证","消息发送成功",function () {

                },{type:'success'});
            }
        });
        captchaButton.disabled=true;
        captchaButton.innerHTML=60;
        timer1=window.setInterval('timer()',1000);
    }
});


document.getElementsByClassName("submit")[0].addEventListener("click",function () {
    let phoneNum=document.getElementById("tel").value;
    let captcha=document.getElementById("captcha").value;
    let name=document.getElementById("name").value;
    if(captcha==""||!/[0-9]{4}/.test(captcha))
    {
        alert("验证","请输入正确的验证码");
        return ;
    }
    if(!/^[a-zA-Z0-9_]{3,16}$/ .test(name))
    {
        alert("验证","用户名输入不符合要求");
        return ;
    }
    ajax("post","/telVerify/captcha/verify",JSON.stringify({phone:phoneNum,captcha:captcha,name:name}),function (reply) {
        if(reply=="ok")
        {
            alert("验证","手机验证成功",function () {
                let querystr=window.location.href;
                window.location.href="/index.html"+querystr.substr(querystr.indexOf("?"));
            },{type:"success"});

        }
        else if(reply=="id exists")
        {
            alert("验证","用户名已存在",function () {
            },{type:'error'});
        }
        else
        {
            alert("验证","手机验证失败",function () {
            },{type:'error'});
            return;
        }

    })
});