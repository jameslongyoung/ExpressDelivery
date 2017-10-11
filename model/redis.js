var redisClient=require("redis").createClient();

var async=require("async");

function get(key,callback) {
    async.waterfall([
        function (callback) {
            redisClient.exists(key,function (err,reply) {
                callback(null,err,reply);
            })
        },
        function (err,reply) {
            if(err)
            {
                console.log(err);
                callback("error");
            }
            else if(reply==0)
            {
                callback("notexist");
            }
            else
            {
                redisClient.get(key,function (err,reply) {
                    if(err)
                    {
                        console.log(err);
                        callback("error");
                    }
                    else
                    {
                        callback(reply);
                    }
                })
            }
        }
    ])

}
function set(key,value,time,callback) {
    let multi=redisClient.multi();
    multi.set(key,value);
    multi.expire(key,time);
    multi.exec(function (err,replies) {
        if(err)
        {
            callback("error");
        }
        else
        {
            callback(replies);
        }
    });
};

module.exports={set:set,get:get};