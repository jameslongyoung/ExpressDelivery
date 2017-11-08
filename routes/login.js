/**
 * Created by wx_swjtu on 2017/9/3.
 * 客户端返回error="true"，服务端返回error:"error"
 */
var express=require("express");
var querystring=require("querystring");
var router=express.Router();
var jiaowu=require("../model/jiaowu");
var async=require("async");
var tools=require("../model/tools");
var redis=require("../model/redis");
var mongo=require("../model/mongo")
router.get("/",function (req,res,next) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(!agentID){
        res.render("error.html",{reasons:"网站不支持pc端，请在移动端查看"});
        return ;
    }
   async.waterfall([
       function (callback) {
           jiaowu.Get_Captcha(1,function (err,imgData,cookie) {
               callback(null,err,imgData,cookie);
           });
       },
       function (err, imgData,cookie,callback) {
            if(err)
            {
                res.render("error.html",{reasons:"服务器错误"});
            }
            else
            {
                res.render("login3.html",{captcha:"",cookie:""});
            }
       },
   ],function (err,result) {
       console.log(err,result);
   });
});
router.post("/login",function (req,res,next) {             //login
    var data="";
    req.on("data",function (chunk) {
        data+=chunk;
    });
    req.on("end",function () {
        var studentInfo=JSON.parse(data);
        async.waterfall([
            function (callback) {
                jiaowu.Login(studentInfo["type"],studentInfo["id"],studentInfo["password"],studentInfo["captcha"],studentInfo["cookie"],function (err,text) {
                    callback(null,err,text);
                });
            },
            function (err,text,callback) {
                if(err)
                {
                    callback(null,"error");
                }
                else if(!text.toString().startsWith("登录成功"))
                {
                    callback(null,"failed",text);
                }
                else
                {
                    let user={"id":studentInfo["id"]};
                    console.log(user);
                    mongo.Search("users",user,function (reply) {
                        if(reply=="error")
                        {
                            callback(null,"error",text);
                        }
                        else
                        {
                            callback(null,reply,text);
                        }
                    });
                }

            },
            function (reply,text) {
                let responseText={error:"",text:"",token:"",isVerify:false};
                if(reply=="error")
                {
                    responseText.error="true";
                    res.end(JSON.stringify(responseText));
                }
                else if(reply=="failed")
                {
                    responseText.text=text;
                    res.end(JSON.stringify(responseText));
                }
                else
                {
                   // console.log(reply);
                    if(reply!="")
                    {
                        responseText.isVerify=true;
                    }
                    let token=tools.md5(studentInfo["id"]+studentInfo["password"]+new Date().getMilliseconds());  //token获取
                    redis.set(studentInfo["id"],token,1800,function (reply) {
                       if(reply=="error")
                       {
                           responseText.error="true";
                       }
                       else
                       {
                           responseText.token=token;
                           responseText.text=text;
                       }
                        res.end(JSON.stringify(responseText));
                    });
                }
            }
        ])
    })
});
router.get("/captcha",function (req,res,next) {        //get_captcha
    let queryStr=querystring.parse(req._parsedUrl.query);
    async.waterfall([
        function (callback) {
            jiaowu.Get_Captcha(queryStr["type"],function (err,imgData,cookie) {
                callback(null,err,imgData,cookie)
            })
        },
        function (err,imgData,cookie,callback) {
            let result={err:"",imgData:"",cookie:""}
            if(err)
            {
                result.err=true;
                res.end(JSON.stringify(result));
            }
            result.imgData=new Buffer(imgData).toString("base64");
            result.cookie=cookie;
            res.end(JSON.stringify(result));
        }
    ])
});
module.exports=router;