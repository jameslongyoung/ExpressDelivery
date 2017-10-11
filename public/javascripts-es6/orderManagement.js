require("babel-polyfill");
document.getElementById("header").style.lineHeight=document.body.clientHeight*0.1+"px";
function getQueryStringByName(name){
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
    if(result == null || result.length < 1){
        return "";
    }
    return result[1];
}

let ids=document.querySelectorAll("._id");
document.querySelectorAll(".item").forEach(function (value,index,array) {
    console.log(ids[index]);
    value.addEventListener("click",function () {
        let url=window.location.href;
        if(getQueryStringByName("release")==true)
        {
            window.location.href="itemDisplay"+url.substr(url.indexOf("?"))+"&item="+ids[index].innerHTML;
        }
        else
        {
            window.location.href="itemDisplay"+url.substr(url.indexOf("?"))+"&item="+ids[index].innerHTML;
        }
    });
});

let items=document.getElementsByClassName("item");
items[0].style.marginTop=document.documentElement.clientHeight*0.1+5+"px";