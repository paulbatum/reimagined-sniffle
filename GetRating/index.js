module.exports = async function (context, req, snifflesInputDoc) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (snifflesInputDoc) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: snifflesInputDoc
        };
    }
    else {
        context.res = {
            status: 404,
            body: "Did not find rating"
        };
    }
};