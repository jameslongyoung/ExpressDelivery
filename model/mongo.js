var MongoClient = require('mongodb').MongoClient;
var ObjectID=require("mongodb").ObjectID;
var async=require("async");

// Connection URL
var url = 'mongodb://localhost:27017/ExpressDelivery';

function Insert(data,collection,callback) {
    async.waterfall([
       function (callback) {
           MongoClient.connect(url, function(err, db) {
               "use strict";
               callback(null,err,db);
           });
       },
        function (err,db) {
            if(err)
            {
                callback("error");
            }
            let collections=db.collection(collection);
            collections.insertOne(data,function (err,result) {
                console.log(result,err);
                if(err)
                {
                    callback("error");
                }
                else
                {
                    callback(result);
                }
            })
        }
    ]);

};

function Search(collection,data,callback) {
    async.waterfall([
        function (callback) {
            MongoClient.connect(url, function(err, db) {
                "use strict";
                console.log(err);
                callback(null,err,db);
            });
        },
        function (err,db) {
            if(err)
            {
                callback("error");
            }
            if(data._id!=undefined)
            {
                data._id=ObjectID(data._id);
            }
            let collections=db.collection(collection);
            collections.find(data).toArray(function (err,docs) {
                if(err)
                {
                    console.log(err);
                    callback("error");
                }
                else
                {
               //     console.log(docs[0]);
                    for(let item of docs)
                    {
                        item._id=item._id.toString();
                    }
                    docs=docs.reverse();
                    callback(docs);
                }
            })
        }
    ]);

};

function update(collection,whereStr,updateStr,callback) {
    if(whereStr._id!=undefined)
    {
        whereStr._id=ObjectID(whereStr._id);
    }
    async.waterfall([
        function (callback) {
            MongoClient.connect(url, function(err, db) {
                "use strict";
                callback(null,err,db);
            });
        },
        function (err,db) {
            if(err)
            {
                callback("error");
                return ;
            }
            let collections=db.collection(collection);
            collections.updateOne(whereStr,updateStr, function(err, result) {
                if(err)
                {
                    callback("error");
                    return;
                }
                callback(result.result.nModified);
            });
        }
    ]);
}

function remove(collection,condition,callback) {
    if(condition._id!=undefined)
    {
        condition._id=ObjectID(condition._id);
    }
    async.waterfall([
        function (callback) {
            MongoClient.connect(url, function(err, db) {
                "use strict";
                callback(null,err,db);
            });
        },
        function (err,db) {
            if(err)
            {
                callback("error");
                return ;
            }
            let collections=db.collection(collection);
            collections.removeMany(condition, function(err, result) {
                if(err)
                {
                    callback("error");
                    return;
                }
                callback(result);
            });
        }
    ]);
}

module.exports={Search:Search,Insert:Insert,update:update,remove:remove};