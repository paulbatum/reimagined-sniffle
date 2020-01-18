var request = require('request-promise');
var https = require('https');


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

    try {
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

    var ratingValue = req.query.rating || (req.body && req.body.rating)
    if (!Number.isInteger(ratingValue) || ratingValue < 0 || ratingValue > 5) {
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

    subscription_key = process.env.sentiment_subscription_key;
    endpoint = "https://westus.api.cognitive.microsoft.com/";

    let documents = {
        'documents': [
            { 'id': '1', 'language': 'en', 'text': userNotesValue }
        ]
    };

    var options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment',
        body:documents,
        headers: {
            'Ocp-Apim-Subscription-Key': subscription_key,
        },
        json: true // Automatically stringifies the body to JSON
    };
    try {

        const result = await request(options);
        sentimentScore = result.documents[0].score;

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
    } catch(error)
    {
        context.res = {
            status: 400,
            body: "Sentiment failed"
        };
    }
};