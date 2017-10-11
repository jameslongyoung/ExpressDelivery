var SMSClient = require('@alicloud/sms-sdk');

function  sendMsg(phoneNumber,captcha,callback) {
    const accessKeyId = 'LTAI26TIrrB1fufT';
    const secretAccessKey = 'aQu0lo7ZKeRW1mSAEhyfnSZCeKMvCv';
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,
        SignName: 'swjtu快递代取平台',
        TemplateCode: 'SMS_97060058',
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

module.exports={sendMsg,sendMsg};