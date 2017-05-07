'use strict';

const request = require('request-promise');

module.exports.hello = (event, context, callback) => {
    sendMessageToSlackChannel('Hello from Lambda! :tada:')
        .then(() => callback(null, 'OK'))
        .catch(error => callback(error, null));
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