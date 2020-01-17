var request = require('request-promise');
module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");

    var uri = context.bindingData.uri;
    var prefix = uri.substring(0, uri.lastIndexOf('/') + 1);

    if(context.bindings.orderLineItems && context.bindings.productInformation && context.bindings.orderHeaderDetails)
    {
        context.log("we have all the files, lets do it");

        var body = {
            "orderHeaderDetailsCSVUrl": prefix.concat(context.bindingData.date, '-OrderHeaderDetails.csv'),
            "orderLineItemsCSVUrl": prefix.concat(context.bindingData.date, '-OrderLineItems.csv'),
            "productInformationCSVUrl": prefix.concat(context.bindingData.date, '-ProductInformation.csv')
        };

        try
        {
            var combined = await request.post('https://serverlessohmanagementapi.trafficmanager.net/api/order/combineOrderContent', {
                body: JSON.stringify(body)
            })

            combined = JSON.parse(combined);
        }
        catch
        {
            throw 'pragna needs to fix this';
        }

        combined.forEach(order => order.id = order.headers.salesNumber);
        
        context.bindings.orderOutput = combined;        
    }
    else
    {
        context.log("We don't have all the files, skipping...")
        return;
    }
};