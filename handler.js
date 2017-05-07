'use strict';

module.exports.hello = (event, context, callback) => {
    sendMessageToSlackChannel('Hello from Lambda! :tada:')
        .then(() => callback(null, 'OK'))
        .catch(error => callback(error, null));
};

function sendMessageToSlackChannel(message) {

    const requestData = JSON.stringify({
        text: message
    });

    return makeHttpsRequest({
        method: 'POST',
        url: process.env.SLACK_WEBHOOK,
        data: requestData,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    });
}

function makeHttpsRequest({method, url, headers = {}, data}) {

    return new Promise((resolve, reject) => {

        const parsedUrl = require('url').parse(url);
        const nativeHttpLibrary = parsedUrl.protocol === 'https:' ? require('https') : require('http');

        const request = nativeHttpLibrary.request({
            hostname: parsedUrl.hostname,
            port: parsedUrl.protocol === 'https:' ? 443 : 80,
            path: parsedUrl.path,
            method: method,
            headers: headers
        }, response => {
            response.setEncoding('utf8');
            let responseBody = '';
            response.on('error', (error) => reject(error));
            response.on('data', (chunk) => responseBody = responseBody + chunk);
            response.on('end', () => resolve({
                status: response.statusCode,
                body: responseBody
            }));
        });

        request.on('error', (error) => reject(error));
        if (data) {
            request.write(data);
        }
        request.end();
    });
}
