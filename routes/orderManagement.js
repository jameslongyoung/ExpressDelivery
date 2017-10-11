var express=require("express");
var router=express.Router();
var redis=require("../model/redis");
var mongo=require("../model/mongo");
var async=require("async");
var querystring=require("querystring");

router.get("/",function (req,res,next) {
    var queryStr=querystring.parse(req._parsedUrl.query);
    async.waterfall([
        function (callback) {
            redis.get(queryStr.id,function (reply) {
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
        function (status,callback) {
            if(status=="error")
            {
                callback("error");
            }
            else
            {
                mongo.Search("users",{id:queryStr.id},function (status) {
                    if(status=="error")
                    {
                        callback(null,"error");
                    }
                    else
                    {
                        callback(null,status[0]);
                    }
                });
            }
        },
        function (status) {
            if(status=="error")
            {
                res.render("error.html","您无权限访问这个页面");
            }
            else
            {
                if(queryStr.release!="true")
                {
                    mongo.Search("items",{user:status.name},function (condition) {
                        if(condition=="error")
                        {
                            res.render("error.html","服务器内部错误");
                        }
                        else{
                            res.render("orderManagement",{item:condition,title:"我的订单",center:"/userPanel?"+req._parsedUrl.query.substring(0,req._parsedUrl.query.lastIndexOf("&"))});
                        }
                    });
                }
                else
                {
                    mongo.Search("items",{creator:status.name},function (condition) {
                        if(condition=="error")
                        {
                            res.render("error.html","服务器内部错误");
                        }
                        else
                        {
                            res.render("orderManagement",{item:condition,title:"我的快递",center:"/userPanel?"+req._parsedUrl.query.substring(0,req._parsedUrl.query.lastIndexOf("&"))});
                        }
                    });
                }

            }
        }
    ])
});

module.exports=router;