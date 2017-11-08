var express=require("express");
var router=express.Router();
var async=require("async");
var redis=require("../model/redis");
var mongo=require("../model/mongo");
var querystring=require("querystring");

router.get("/",function (req,res,next) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(!agentID){
        res.render("error.html",{reasons:"网站不支持pc端，请在移动端查看"});
        return ;
    }
    var queryStr=querystring.parse(req._parsedUrl.query);
    console.log(queryStr);
    async.waterfall([
        function (callback) {
            redis.get(queryStr.id,function (reply) {
                console.log(reply);
                if(reply!=queryStr.token)
                {
                    callback(null,"error");
                }
                else
                {
                    callback(null,"ok");
                }
            })
        },
        function (status) {
            if(status=="error")
            {
                res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
            }
            else
            {
                mongo.Search("users",{id:queryStr.id},function (status) {
                    if(status=="error")
                    {
                        res.render("error.html",{reasons:"服务器内部错误"});
                    }
                    else
                    {
                        res.render("userPanel.html",{user:status[0].name});
                    }
                })
            }
        }
    ]);
});


module.exports=router;