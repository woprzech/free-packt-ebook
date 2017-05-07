'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');

module.exports.hello = (event, context, callback) => {
    fetchPacktPage()
        .then(body => getBookInfo(body))
        .then(bookTitle => {
            return sendMessageToSlackChannel(bookTitle)
                .then(() => callback(null, 'OK'));
        })
        .catch(err => callback(error, null));
};

function sendMessageToSlackChannel(message) {

    const requestData = {
        text: message
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
            console.log('Wszystko porzło dobrze');
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
    return $('.dotd-main-book .dotd-title h2').text();
}