/**
 * Created by wx_swjtu on 2017/9/2.
 */
var express = require('express');
var router = express.Router();
var async=require("async");
var mongo=require("../model/mongo");
var redis=require("../model/redis");
var querystring=require("querystring");

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
               res.render("form.html");
           }
       }
    ]);
});

router.post('/submit',function (req,res,next) {
    let data="";
    req.on("data",function (chunk) {
        data+=chunk;
    });
    req.on("end",function () {
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
                    callback(null,"no auth")
                }
                else
                {
                    mongo.Search("users",{id:queryStr.id},function (result) {
                        if(result=="error")
                        {
                            callback(null,"error")
                        }
                        else
                        {
                            callback(null,result[0]);
                        }
                    });
                }
            },
            function (status) {
                if(status=="error"||status=="no auth")
                {
                    res.end(status);
                }
                else
                {
                    data=JSON.parse(data);
                    data.creator=status.name;
                    data.phone=status.phone;
                    mongo.Insert(data,"items",function (status) {
                        if(status=="error")
                        {
                            res.end("error");
                        }
                        else
                        {
                            res.end("ok");
                        }
                    })
                }
            }
        ]);
    });

})

module.exports = router;
