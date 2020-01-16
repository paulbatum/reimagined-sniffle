module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var productId = req.query.productId || (req.body && req.body.productId);
    if (productId) {
        context.res = {
            status: 200,
            body: `The product name for your product id ${productId} is Starfruit Explosion`
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a product id"
        };
    }
};