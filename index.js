const request = require('request');
const AWS = require('aws-sdk');
const vandium = require('vandium');

exports.handler = vandium((event, context, callback) => {
    'use strict';
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    request.get('http://www.w3schools.com/website/customers_mysql.php',
                function(err, response, body){
                    if (err) {
                        return callback(err);
                    }
                    const dynamo = new AWS.DynamoDB.DocumentClient();
                    dynamo.scan('something', function(err, results) {
                        return callback(null, results);
                    }); 
                }
    );

});
