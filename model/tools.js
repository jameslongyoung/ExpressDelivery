var crypto=require('crypto');

function md5(str) {
    var md5=crypto.createHash("md5");
    md5.update(str);
    return md5.digest('hex').toUpperCase();
}

function getRandomNum(n) {
    let result="";
    for(let i=0;i<n;i++)
    {
        result+=parseInt(Math.random()*9);
    }
    return result;
}

module.exports={md5:md5,getRandomNum:getRandomNum};