var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var userId;
    if (req.query.userId || (req.body && req.body.userId)) {
        userId = req.query.userId || req.body.userId;
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a userId on the query string or in the request body"
        };
        return;
    }
    var productId;
    if (req.query.productId || (req.body && req.body.productId)) {
        productId = req.query.productId || req.body.productId;
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
    var productsUrl = `http://serverlessohproduct.trafficmanager.net/api/GetProduct?productId=${productId}`;
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
    var userIdsUrl = `http://serverlessohuser.trafficmanager.net/api/GetUser?UserId=${userId}`;
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

    context.res = {
        status: 200,
        body: "Happy World"
    };
};