var express=require("express");
var router=express.Router();
var mongo=require("../model/mongo");
var redis=require("../model/redis");
var querystring=require("querystring");
var async=require("async");

router.get("/",function (req,res,next) {
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
        function (status,callback) {
            if(status=="error")
            {
                res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
            }
            else
            {
                mongo.Search("comment",{id:queryStr.item},function (result) {
                   if(result=="error")
                   {
                       res.render("error.html",{reasons:"服务器内部错误"});
                   }
                   else
                   {
                       if(result.length==0)
                       {
                            res.render("comment.html");
                       }
                       else
                       {
                           res.render("comment.html",{val:result[0].content,star:'<script>document.getElementById("star'+result[0].star+'").click()'+"</script>"})
                       }
                   }
                })
            }
        }
    ]);
});

router.post("/submit",function (req,res,next) {
    var queryStr=querystring.parse(req._parsedUrl.query);
    let data="";
    req.on("data",function (chunk) {
        data+=chunk;
    });
    req.on("end",function () {
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
            function (status,callback) {
                if(status=="error")
                {
                    callback(null,"error");
                }
                else
                {
                    mongo.Search("users",{id:queryStr.id},function (status) {
                        if(status=="error")
                        {
                            callback(null,"internal error");
                        }
                        else
                        {
                            callback(null,status);
                        }
                    });
                }
            },
            function (status,callback) {
                if(status=="error"||status=="internal error")
                {
                    callback(null,status);
                }
                mongo.Search("items",{_id:queryStr.item},function (condition) {
                    if(status=="error")
                    {
                        callback(null,"internal error");
                    }
                    else
                    {
                        if(condition.creator!=status.name)
                        {
                            callback(null,"no auth");
                        }
                        else
                        {
                            callback(null,"ok");
                        }
                    }
                })
            },
            function (status,callback) {
                if(status=="error"||status=="internal error"||status=="no auth")
                {
                    callback(null,status);
                }
                else
                {
                    mongo.Search("comment",{id:queryStr.item},function (result) {
                        if(result=="error")
                        {
                            callback(null,"internal error");
                        }
                        else
                        {
                            callback(null,result);
                        }
                    })
                }
            },
            function (result) {
                if(result=="error"||result=="no auth"||result=="internal error")
                {
                    res.end(result);
                }
                else
                {
                    if(result.length==1)
                    {
                        res.end("already comment");
                    }
                    else
                    {
                        data=JSON.parse(data);
                        data.id=queryStr.item;
                        mongo.Insert(data,"comment",function (result) {
                           if(result=="error")
                           {
                               res.end("internal error");
                           }
                           else
                           {
                               res.end("ok");
                           }
                        });
                    }

                }
            }
        ])
    })

});

module.exports=router;