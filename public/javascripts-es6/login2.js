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
};
document.getElementsByClassName("login__submit")[0].addEventListener("click",function () {
    let id=document.getElementById("studentId").value;
    let password=document.getElementById("password").value;
    let captcha=document.getElementById("ranstring").value;
    let cookie=document.getElementById("cookie").value;
    if(id==""||password==""||captcha=="")
    {
        alert("请把信息输入完整");
        return ;
    }
    ajax("post","/login",JSON.stringify({id:id,password:password,captcha:captcha,cookie:cookie}),function (responseText) {
        if(responseText.error=="err")
        {
            alert("请求失败");
        }
        else
        {
            //  responseText=responseText.text.replace(/[\r\n]/g,"");
            let result=JSON.parse(responseText);
            if(result.err)
            {
                alert("请求失败");
            }
            else
            {
                let loginResult=result.text;
                console.log(result);
                if(loginResult.startsWith("登录成功"))
                {
                    alert("登录",loginResult,function () {
                        if(result.isVerify)
                            window.location.href="index?id="+id+"&token="+result.token;
                        else
                        {
                            window.location.href="telVerify?id="+id+"&token="+result.token;
                        }
                    },{type:'success'});
                }
                else
                {
                    alert("登录",loginResult,function () {
                    },{type:'error'});
                }

                //  console.log(loginResult);
            }
        }
    });
});
document.getElementById("captcha").addEventListener("click",function () {
    ajax("get","/captcha","",function (responseText) {
        let result=JSON.parse(responseText);
        document.getElementById("captcha").setAttribute("src","data:image/png;base64,"+result.imgData);
        document.getElementById("cookie").setAttribute("value",result.cookie);
    })
})