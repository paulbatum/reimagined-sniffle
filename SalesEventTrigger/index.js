var request = require('request-promise');
const { BlobServiceClient } = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
module.exports = async function (context, eventHubMessages) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.secretstorageconnection);
    // Get a reference to a container
    const containerClientReceipts = await blobServiceClient.getContainerClient("receipts");
    const containerClientReceiptsHighValue = await blobServiceClient.getContainerClient("receipts-high-value");

    context.log(`JavaScript eventhub trigger function called for message array}`);
    var receiptsArray = [];
    var highValueReceiptsArray = [];
    for (var index = 0; index < eventHubMessages.length; index++) {
        var message = eventHubMessages[index];
        context.log(`Processed message ${message}`);
        var parsedMessage = message.header;
        var outReceipt = {
            "Store": parsedMessage.store,
            "SalesNumber": parsedMessage.salesNumber,
            "TotalCost": parsedMessage.totalCost,
            "Items": parsedMessage.totalItems,
            "SalesDate": parsedMessage.salesDate
        }
        // Create a unique name for the blob
        const blobName = 'receipt-' + uuidv1() + '.json';

        // Get a block blob client
        ;

        // Upload data to the blob

        if (parsedMessage.receiptUrl) {
            if (parsedMessage.totalCost >= 100) {
                try {
                    var receipt = await request.get(parsedMessage.receiptUrl);
                    var receiptBuffer = new Buffer(receipt);
                    var encodedReceipt = receiptBuffer.toString('base64');
                    outReceipt.ReceiptImage = encodedReceipt;
                    context.log(`Adding highValue Receipt`);

                    var data = JSON.stringify(outReceipt);
                    const blockBlobClient1 = containerClientReceiptsHighValue.getBlockBlobClient(blobName)
                    var uploadBlobResponse = await blockBlobClient1.upload(data, data.length);
                    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
                }
                catch
                {
                    context.log(`Did not find reciept at ${parsedMessage.receiptUrl}`);
                }
            }
            else {
                context.log(`Adding Receipt`);
                var data = JSON.stringify(outReceipt);
                const blockBlobClient2 = containerClientReceipts.getBlockBlobClient(blobName)
                var uploadBlobResponse = await blockBlobClient2.upload(data, data.length);
                console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
            }
        }
    };
    context.bindings.salesOutput = eventHubMessages;
};