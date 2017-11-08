var express = require('express');
var router = express.Router();
var querystring=require("querystring");
var redis=require("../model/redis");
var async=require("async");
var mongo=require("../model/mongo");
/*
item json
{
user:"",
time:"",
name:"",
from:"",
to:"",
phone:"",
salary:"",
note:""
isOrder:""
}
* */

/* GET home page. */
router.get('/', function(req, res, next) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(!agentID){
        res.render("error.html",{reasons:"网站不支持pc端，请在移动端查看"});
        return ;
    }
    var queryStr=querystring.parse(req._parsedUrl.query);
    async.waterfall([
        function (callback) {
            redis.get(queryStr.id,function (reply) {
                console.log(reply);
                if(reply!=queryStr.token)
                {
                    callback(null,"no auth");
                }
                else
                {
                    callback(null,"ok");
                }
            })
        },
        function (status) {
            if(status=="no auth")
            {
                res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
                return ;
            }
            else
            {
                let date=new Date();
                let [year,month,day,hour,minute]=[date.getFullYear(),date.getMonth()+1,date.getDay()+1,date.getHours(),date.getMinutes()];
                if(month<10)
                    month="0"+month;
                if(day<10)
                    day="0"+day;
                if(hour<10)
                    hour="0"+hour;
                if(minute<10)
                    minute="0"+minute;
              //  console.log(year+"-"+month+"-"+day+" | "+hour+":"+minute);
                mongo.Search("items",{is_order:false,time:{$gt:year+"-"+month+"-"+day+" | "+hour+":"+minute}},function (reply) {
                    for(let i of reply)
                    {
                        i._id=i._id.toString();
                    }
                    res.render('index.html',{item:reply,userPanel:"/userPanel?"+req._parsedUrl.query});
                    return ;
                });
            }
        }
    ])


});

module.exports = router;
