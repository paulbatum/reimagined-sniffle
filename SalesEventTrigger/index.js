var request = require('request-promise');
module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    eventHubMessages.forEach((message, index) => {
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
                    context.bindings.highValueReceiptOutputBlob = outReceipt;
                }
                catch
                {
                    context.log(`Did not find reciept at ${parsedMessage.receiptUrl}`);
                }
            }
            else
            {
                context.bindings.receiptOutputBlob = outReceipt;
            }
        }
    });
    context.bindings.salesOutput = eventHubMessages;
};