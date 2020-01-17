module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.bindings.recieptTesting = req.body || "placeholder";    
};