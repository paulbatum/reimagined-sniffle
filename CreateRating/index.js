var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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

    // Validate ProductID
    var xmlHttp = new XMLHttpRequest();
    var productsUrl = `http://serverlessohproduct.trafficmanager.net/api/GetProduct?productId=${productIdValue}`;
    xmlHttp.open( "GET", productsUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    if( xmlHttp.status != 200)
    {
        context.res = {
            status: 400,
            body: "Please pass a valid productId on the query string or in the request body"
        };
        return;
    }
    // Validate User ID
    var userIdsUrl = `http://serverlessohuser.trafficmanager.net/api/GetUser?UserId=${userIdValue}`;
    xmlHttp.open( "GET", userIdsUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    if( xmlHttp.status != 200)
    {
        context.res = {
            status: 400,
            body: "Please pass a valid UserId on the query string or in the request body"
        };
        return;
    }

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
    var outputSniffledDoc = JSON.stringify({
        userId: userIdValue,
        productId: productIdValue,
        timestamp: Date.now(),
        rating: ratingValue,
        locationName: locationNameValue,
        userNotes: userNotesValue
      });
    context.bindings.outputSniffledDoc = outputSniffledDoc;

    context.res = {
        status: 200,
        body: outputSniffledDoc
    };
};