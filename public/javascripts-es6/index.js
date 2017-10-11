require("babel-polyfill");
document.getElementById("header").style.lineHeight=document.body.clientHeight*0.1+"px";
let items=document.getElementsByClassName("item");
if(items.length==0)
{
    document.getElementsByClassName("container")[0].style.backgroundColor="white";
    alert("订单","目前无快递要取",function () {
    },{type:"error"});
}
else
{
    //items[0].style.marginTop=document.documentElement.clientHeight*0.1+5+"px";
    let ids=document.getElementsByClassName("hidden");
    for(let i in items)
    {
        items[i].addEventListener('click',function () {
            let url=window.location.href;
            window.location.href="itemDisplay"+url.substr(url.indexOf("?"))+"&item="+ids[i].innerHTML;
        });
    }
}

