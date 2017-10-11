require("babel-polyfill");

let menu_item=document.querySelectorAll(".menu__item>li");
let url=window.location.href;
let queryStr=url.substr(url.indexOf("?"));
menu_item[0].addEventListener("click",function () {
    window.location.href="/orderManagement"+queryStr+"&release=false";
});
menu_item[1].addEventListener("click",function () {
    window.location.href="/orderManagement"+queryStr+"&release=true";
});
menu_item[2].addEventListener("click",function () {
   window.location.href="/form"+queryStr;
});

menu_item[3].addEventListener("click",function () {
    window.location.href="/index"+queryStr;
});

menu_item[4].addEventListener("click",function () {
    window.location.href="/";
});