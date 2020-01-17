var request = require('request-promise');
module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    var receiptsArray = [];
    var highValueReceiptsArray = [];
    for (var index = 0; index < eventHubMessages.length; index++) {
        var message = eventHubMessages[index];
        context.log(`Processed message ${message}`);
        var parsedMessage = JSON.parse(message);
        var outReceipt = {
            "Store": parsedMessage.store,
            "SalesNumber": parsedMessage.SalesNumber,
            "TotalCost": parsedMessage.totalCost,
            "Items": parsedMessage.totalItems,
            "SalesDate": parsedMessage.salesDate
        }
        if (parsedMessage.receiptUrl) {
            if (parsedMessage.totalCost >= 100) {
                try {
                    var receipt = await request.get(parsedMessage.receiptUrl);
                    var receiptBuffer = new Buffer(receipt);
                    var encodedReceipt = receiptBuffer.toString('base64');
                    outReceipt.ReceiptImage = encodedReceipt;
                    highValueReceiptsArray.push(outReceipt);
                }
                catch
                {
                    context.log(`Did not find reciept at ${parsedMessage.receiptUrl}`);
                }
            }
            else {
                receiptsArray.push(outReceipt);
            }
        }
    };
    context.bindings.salesOutput = eventHubMessages;
    context.bindings.receiptOutputBlob = receiptsArray;
    context.bindings.highValueReceiptOutputBlob = highValueReceiptsArray;
};