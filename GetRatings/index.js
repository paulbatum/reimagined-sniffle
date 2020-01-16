module.exports = async function (context, req) {
    
    var ratings = context.bindings.ratings;
    context.log(`Found ${ratings.length} ratings`);

    context.res = {
        status: 200,
        body: ratings
    };
};