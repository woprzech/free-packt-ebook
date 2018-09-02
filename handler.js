'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');

module.exports.hello = (event, context, callback) => {
    fetchPacktPage()
        .then(body => getBookInfo(body))
        .then(bookInfo => {
            console.log(bookInfo.photo);
            return sendMessageToSlackChannel(bookInfo)
                .then(() => callback(null, 'OK'));
        })
        .catch(err => callback(error, null));
};

function sendMessageToSlackChannel(bookInfo) {

    const requestData = {
        "attachments": [
            {
                "fallback": bookInfo.title,
                "title": 'Dzisiejszy darmowy ebook',
                "title_link": "https://www.packtpub.com/packt/offers/free-learning",
                "text": bookInfo.title,
                "image_url": bookInfo.photo.replace(/ /g, "%20"),
                "color": "#4285f4"
            }
        ]
    };

    var options = {
        method: 'POST',
        uri: process.env.SLACK_WEBHOOK,
        body: requestData,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    };

    return request(options)
        .then(function (parsedBody) {
            console.log('Wszystko poszło dobrze');
        })
        .catch(function (err) {
            console.log(err);
        });
}

function fetchPacktPage() {
    return request('https://www.packtpub.com/packt/offers/free-learning');

}

function getBookInfo(body) {
    const $ = cheerio.load(body);
    return {
        title: $('.dotd-main-book .dotd-title h2').text(),
        photo: '' + $('.dotd-main-book-image img')['0'].attribs.src
    };
}