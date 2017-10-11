var express=require("express");
var router=express.Router();
var mongo=require("../model/mongo");
var querystring=require("querystring");
var redis=require("../model/redis");
var phoneMsg=require("../model/phoneMsg")
var async=require("async");
var tools=require("../model/tools");


router.get("/",function (req,res,next) {
    var queryStr=querystring.parse(req._parsedUrl.query);
    redis.get(queryStr.id,function (reply) {
        console.log(reply);
        if(reply!=queryStr.token)
        {
            res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
        }
        else
        {
            res.render("telVerify.html");
        }
    })
});

router.post("/captcha",function (req,res,next) {
    var data="";
    req.on("data",function (chunk) {
        data+=chunk;
    });
    req.on("end",function () {
        let phonoNum=JSON.parse(data).phone;
        let url=JSON.parse(data).url;
        let querystr=querystring.parse(url.toString().substr(url.indexOf("?")+1));
        async.waterfall([
            function (callback) {
                redis.get(querystr.id,function (reply) {
                    if(reply==querystr.token)
                    {
                        callback(null,"ok");
                    }
                    else
                    {
                        callback(null,"error");
                    }
                });
            },
            function (condition,callback) {
                if(condition=="error")
                {
                    callback(null,"error");
                }
                mongo.Search("users",{phone:phonoNum},function (reply) {
                    if(reply=="error")
                    {
                        callback(null,"error");
                    }
                    else if(reply=="")
                    {
                        callback(null,"ok");
                    }
                    else
                    {
                        callback(null,"tel exists");
                    }
                });
            },
            function (condition,callback) {
                if(condition=="error"||condition=="tel exists")
                {
                    callback(null,condition);
                }
                else
                {
                    let randomNum=tools.getRandomNum(4);
                    phoneMsg.sendMsg(phonoNum,randomNum,function (status) {
                        if(status=="ok")
                        {
                            callback(null,randomNum);
                        }
                        else
                        {
                            callback(null,"error");
                        }
                    });
                }
            },
            function (condition) {
                if(condition=="error"||condition=="tel exists")
                {
                    res.end(condition);
                }
                else
                {
                    let person={id:querystr.id,captcha:condition};
                    redis.set(phonoNum,JSON.stringify(person),300,function (reply) {
                        if(reply=="error")
                        {
                            res.end("error");
                        }
                        else
                        {
                            res.end("ok");
                        }
                    });
                }

            }
        ])
    })
});

router.post("/captcha/verify",function (req,res,next) {
    var data="";
    req.on("data",function (chunk) {
        data+=chunk;
    })
    req.on("end",function () {
        let info=JSON.parse(data);
        async.waterfall([
            function (callback) {
                mongo.Search("users",{name:info.name},function (status) {
                    if(status=="error")
                        callback(null,"error");
                    else if(status=="")
                    {
                        callback(null,"ok");
                    }
                    else if(status.length>0)
                    {
                        callback(null,"id exists");
                    }
                })
            },
           function (status,callback) {
                if(status=="error"||status=="id exists")
                {
                    callback(null,status);
                }
                else
                {
                    redis.get(info.phone,function (reply) {
                        if(reply=="error")
                        {
                            callback(null,"error");
                        }
                        else if(reply=="notexist")
                        {
                            callback(null,"error");
                        }
                        else
                        {
                            let condition=JSON.parse(reply);
                            if(condition.captcha==info.captcha)
                                callback(null,condition.id);
                            else
                                callback(null,"error");

                        }
                    })
                }

           },
            function (status) {
                if(status=="error"||status=="id exists")
                {
                    res.end(status);
                }
                else
                {
                    mongo.Insert({id:status,phone:info.phone,name:info.name},"users",function (reply) {
                        if(reply=="error")
                        {
                            res.end("error");
                        }
                        else
                        {
                            res.end("ok");
                        }
                    });
                }

            }
        ]);

    })
});

module.exports=router;