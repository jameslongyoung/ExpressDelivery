var SMSClient = require('@alicloud/sms-sdk');
var uuid=require("uuid/v1");
function  sendMsg(phoneNumber,captcha,callback) {
    const accessKeyId = 'LTAI26TIrrB1fufT';
    const secretAccessKey = 'aQu0lo7ZKeRW1mSAEhyfnSZCeKMvCv';
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,
        SignName: 'swjtu快递代取平台',
        TemplateCode: 'SMS_970600584',
        TemplateParam: '{"code":'+captcha+'}',
    }).then(function (res) {
        let {Code}=res;
        if (Code === 'OK') {
            callback("ok");
        }
        else
        {
            callback("error");
        }
    }, function (err) {
        callback("error");
    })
}

function sendNoticemsg(phoneNumber,name,callback) {
    const accessKeyId = 'LTAI26TIrrB1fufT';
    const secretAccessKey = 'aQu0lo7ZKeRW1mSAEhyfnSZCeKMvCv';
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    smsClient.sendSMS({
        "PhoneNumbers": phoneNumber,
        "SignName": 'swjtu快递代取平台',
        "TemplateCode": 'SMS_102815054',
        "TemplateParam":  '{name:"'+name+'"}',
    }).then(function (res) {
        let {Code}=res;
        if (Code === 'OK') {
            callback("ok");
        }
        else
        {
            callback("error");
        }
    }, function (err) {
        console.log(err);
        callback("error");
    })
}


module.exports={sendMsg:sendMsg,sendNoticemsg:sendNoticemsg};