var express = require('express');
const request = require('request');
const PUSH_TARGET_URL = 'https://api.line.me/v2/bot/message/push'
const REPLY_TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'Zd+BLpi6wLHMngB3EK74S1W7ApnAXuYZ86xGIi60JKrSW0xI0JyXlCzpunYxk9fxtOkH4y2/CNrb6K7WYldpXBwUkCKNIyEQ04AUpQKQ1EzS6C3qm6y5sBm0zs/Gmzn6n1v1jLfmSpxyLir7VqHk5wdB04t89/1O/w1cDnyilFU='
const USER_ID = 'Uaa6ee8ae309532533aead588d062180d'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "osschatbot.tk"
const sslport = 23023;

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

request.post(
    {
        url: PUSH_TARGET_URL,
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        },
        json: {
            "to": `${USER_ID}`,
            "messages":[
                {
                    "type":"sticker",
                    "packageId":"11538",
                    "stickerId":"51626517"
                },
                {
                    "type":"text",
                    "text":"안녕하세요\n"+
                    "음식추천 챗봇 쿠밥봇입니다\n\n"+
                    "원하시는 메뉴를 골라주세요\n\n"+
                    "1.한식2.중식3.양식\n"+
                    "4.일식.5.분식6.아시안\n"+
                    "7.패스트푸드8.학식"
                },
                {
                    "type":"text",
                    "text":"Welcome!!!\n" +
                    "I'm a food recommendation chatbot, KHUBABBOT\n"+
                    "Please choose the menu you want\n"+
                    "1. Korean food 2. Chinese food 3. Western food\n"+
                    "4. Japanese food 5. Snack food 6. Asian food\n"+
                    "7. Fast food 8. School food\n"
                }
            ]
        }
    },(error, response, body) => {
        console.log(body)
    });

app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    const foodArr = [
        {index : 1, name: "한식"}, 
        {index : 2, name: "중식"}, 
        {index : 3, name: "양식"}, 
        {index : 4, name: "일식"}, 
        {index : 5, name: "분식"}, 
        {index : 6, name: "아시안"}, 
        {index: 7, name: "패스트푸드"}, 
        {index: 8, name: "학식"}
    ];

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);
    
    var food = foodArr.find(element => element.index ==  message.text || element.name == message.text);

    console.log(food);

    request.post(
        {
            url: REPLY_TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                    "type": "location",
                    "title": "my location",
                    "address": "1-6-1 Yotsuya, Shinjuku-ku, Tokyo, 160-0004, Japan",
                    "latitude": 35.687574,
                    "longitude": 139.72922
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
    
    res.sendStatus(200);
});

try {
    const option = {
        ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
        key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
        cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
    
    HTTPS.createServer(option, app).listen(sslport, () => {
        console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
    } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
    }