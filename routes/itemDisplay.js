var express=require("express");
var router=express.Router();
var mongo=require("../model/mongo");
var querystring=require("querystring");
var redis=require("../model/redis");
var async=require("async");
var msg=require("../model/phoneMsg");

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
        function (status) {
            if(status=="ok")
            {
                if(queryStr.item!=undefined)
                {
                    mongo.Search("items",{_id:queryStr.item},function (status) {
                        if(status=="error")
                        {
                            res.render("error.html",{reasons:"服务器内部错误"});
                        }
                        else if(status.length==0)
                        {
                            res.render("error.html",{reasons:"没有找到这个商品，可能已经被撤销"});
                        }
                        else
                        {
                            if(queryStr.release=="true")
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
                                mongo.Search("users",{id:queryStr.id},function (result) {
                                    if(result=="error")
                                    {
                                        res.render("error.html",{reasons:"服务器内部错误"});
                                    }
                                    else
                                    {

                                        if(status[0].creator==result[0].name)
                                        {
                                            if(status[0].user==null&&status[0].time<year+"-"+month+"-"+day+" | "+hour+":"+minute)
                                            {
                                                res.render("itemDisplay.html",{item:status[0],buttonName:"订单超时已关闭"});
                                            }
                                            else if(status[0].user==null)
                                            {
                                                res.render("itemDisplay.html",{item:status[0],buttonName:"撤销订单",script:"javascripts/itemDisplay-3.js"});
                                            }
                                            else if(status[0].closed==false) {
                                                status[0].phone=status[0].userPhone;
                                                res.render("itemDisplay.html", {
                                                    item: status[0],
                                                    buttonName: "确认收货",
                                                    script: "javascripts/itemDisplay-2.js",
                                                });
                                            }
                                            else
                                                res.render("itemDisplay.html",{item:status[0],buttonName:"订单完成",comment:'<a href="comment?'+req._parsedUrl.query+'">评价</a>',script:"javascripts/itemDisplay-4.js"});
                                        }
                                        else
                                        {
                                            res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
                                        }
                                    }
                                });

                            }
                            else if(queryStr.release=="false")
                            {
                                mongo.Search("users",{id:queryStr.id},function (result) {
                                    if(result=="error")
                                    {
                                        res.render("error.html",{reasons:"服务器内部错误"});
                                    }
                                    else
                                    {
                                        if(status[0].user==result[0].name)
                                        {
                                            if(status[0].closed==true)
                                            {
                                                status[0].phone="订单已关闭不可见";
                                                res.render("itemDisplay.html",{item:status[0],buttonName:"订单关闭",script:"javascripts/itemDisplay-5.js"});
                                            }
                                            else
                                            {
                                                res.render("itemDisplay.html",{item:status[0],buttonName:"确认送达",script:"javascripts/itemDisplay-5.js"});
                                            }
                                        }
                                        else
                                        {
                                            res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
                                        }
                                    }
                                });
                            }
                            else if(status[0].is_order==true)
                            {
                                res.render('error.html',{reasons:'<script>alert("此订单已经被抢");window.history.back();location.reload()</script>'});
                            }
                            else
                            {
                                status[0].phone="抢单成功后可见";
                                res.render("itemDisplay.html",{item:status[0],buttonName:"抢单",script:"javascripts/itemDisplay.js"});
                            }

                        }
                    });
                }
            }
            else
            {
                res.render("error.html",{reasons:"您无权限访问这个页面，请访问"});
            }
        }
    ]);
});
router.post("/order",function (req,res,next) {
    var queryStr=querystring.parse(req._parsedUrl.query);
    async.waterfall([
       function (callback) {
            if(queryStr.id==undefined)
            {
                callback(null,"error");
                return ;
            }
           redis.get(queryStr.id,function (reply) {
               if(reply!=queryStr.token)
               {
                   callback(null,"error");
               }
               else
               {
                   callback(null,"ok");
               }
           });
       },
       function (status,callback) {
            if(status=="error")
            {
                callback(null,"no auth")
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
                        callback(null,status);
                    }
                });
            }
       },
        function (status,callback) {
          if(status=="no auth"||status=="error")
          {
              callback(null,status);
          }
          else
          {
              mongo.Search("items",{_id:queryStr.item,user:null},function (condition) {
                  if(status[0].name==condition[0].creator)
                  {
                      callback(null,"the goods can't be ordered by yourself");
                  }
                  else
                  {
                      callback(null,status);
                  }
              })
          }
        },
        function (status,callback) {
            if(status=="no auth"||status=="error"||status=="the goods can't be ordered by yourself")
            {
                callback(null,status);
            }
            else
            {
                mongo.update("items",{_id:queryStr.item,user:null},{$set:{user:status[0].name,is_order:true,userPhone:status[0].phone}},function (condition) {
                    callback(null,condition,status);
                })
            }
        },
        function (status,condition) {
            if(status=="error"||status=="no auth"||status=="the goods can't be ordered by yourself")
            {
                res.end(status);
            }
            else if(parseInt(status)==0)
            {
                res.end("order failed");
            }
            else
            {
                msg.sendNoticemsg(condition[0].phone,condition[0].name,function (status) {
                    console.log(status);
                });
                res.end("success");
            }
        }
    ]);
});

router.post("/confirm",function (req,res,next) {
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
               res.end("error");
           }
           else
           {
               mongo.update("items",{_id:queryStr.item},{$set:{closed:true}},function (status) {
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
router.post("/cancel",function (req,res,next) {
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
                res.end("error");
            }
            else
            {
               mongo.remove("items",{_id:queryStr.item},function (status) {
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

module.exports=router;
