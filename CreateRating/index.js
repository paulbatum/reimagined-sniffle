var request = require('request-promise');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var userIdValue;
    if (req.query.userId || (req.body && req.body.userId)) {
        userIdValue = req.query.userId || req.body.userId;
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a userId on the query string or in the request body"
        };
        return;
    }
    var productIdValue;
    if (req.query.productId || (req.body && req.body.productId)) {
        productIdValue = req.query.productId || req.body.productId;
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a productId on the query string or in the request body"
        };
        return;
    }

    // Validate
    var productsUrl = `http://serverlessohproduct.trafficmanager.net/api/GetProduct?productId=${productIdValue}`;
    var userIdsUrl = `http://serverlessohuser.trafficmanager.net/api/GetUser?UserId=${userIdValue}`;

    try
    {
        await request.get(productsUrl);
        await request.get(userIdsUrl);
    }
    catch
    {
        context.res = {
            status: 400,
            body: "Please pass a valid productId and userId on the query string or in the request body"
        };
        return;
    }

    // // Validate User ID
    // 
    // xmlHttp.open( "GET", userIdsUrl, false ); // false for synchronous request
    // xmlHttp.send( null );
    // if( xmlHttp.status != 200)
    // {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a valid UserId on the query string or in the request body"
    //     };
    //     return;
    // }

    var ratingValue = req.query.rating || (req.body && req.body.rating)
    if (!Number.isInteger(ratingValue) || ratingValue < 0 || ratingValue > 5)
    {
            context.res = {
                status: 400,
                body: "Please pass a valid rating on the query string or in the request body"
            };
            return;
    }
    var locationNameValue = req.query.locationName || (req.body && req.body.locationName)
    var userNotesValue = req.query.userNotes || (req.body && req.body.userNotes)

    //Send userNotes through sentiment Analysis

var sentimentScore; 

    'use strict';

let https = require ('https');

subscription_key = "bca96e65e74b4ddd846523adb2c2db6f";
endpoint = "https://westus.api.cognitive.microsoft.com/";

let path = '/text/analytics/v2.1/sentiment';

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        let body_ = JSON.parse(body);
        let body__ = JSON.stringify(body_, null, '  ');
        console.log(body__);

        console.log("debugging docs");
        console.log(sentimentScore);    
        
        sentimentScore = body_.documents[0].score;
        console.log.metric("Sentiment", sentimentScore);

            var outputSniffledDoc = JSON.stringify({
                userId: userIdValue,
                productId: productIdValue,
                timestamp: Date.now(),
                rating: ratingValue,
                locationName: locationNameValue,
                userNotes: userNotesValue,
                sentimentScore: sentimentScore
              });
            context.bindings.outputSniffledDoc = outputSniffledDoc;
        
            context.res = {
                status: 200,
                body: outputSniffledDoc
            };
    
    
    
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let get_sentiments = function (documents) {
    let body = JSON.stringify(documents);

    let request_params = {
        method: 'POST',
        hostname: (new URL(endpoint)).hostname,
        path: path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscription_key,
        }
    };

    let req = https.request(request_params, response_handler);
    req.write(body);
    req.end();
}

let documents = {
    'documents': [
        { 'id': '1', 'language': 'en', 'text': userNotesValue}
    ]
};

get_sentiments(documents);

};