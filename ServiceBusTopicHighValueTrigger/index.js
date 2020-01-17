var request = require('request-promise');
const { BlobServiceClient } = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');

module.exports = async function (context, mySbMsg) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.secretstorageconnection);
    // Get a reference to a container
    const containerClientReceiptsHighValue = await blobServiceClient.getContainerClient("receipts-high-value");

    context.log('JavaScript ServiceBus topic trigger function processed message', mySbMsg);
    var parsedMessage = JSON.parse(mySbMsg);
    var outReceipt = {
        "Store": parsedMessage.store,
        "SalesNumber": parsedMessage.salesNumber,
        "TotalCost": parsedMessage.totalCost,
        "Items": parsedMessage.totalItems,
        "SalesDate": parsedMessage.salesDate
    }
    // Create a unique name for the blob
    const blobName = 'highValueReceipt-' + uuidv1() + '.json';
    if (parsedMessage.receiptUrl) {
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
};