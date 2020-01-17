const { BlobServiceClient } = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
module.exports = async function (context, mySbMsg) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.secretstorageconnection);
    // Get a reference to a container
    const containerClientReceipts = await blobServiceClient.getContainerClient("receipts");

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
    const blobName = 'receipt-' + uuidv1() + '.json';
    context.log(`Adding Receipt`);
    var data = JSON.stringify(outReceipt);
    const blockBlobClient2 = containerClientReceipts.getBlockBlobClient(blobName)
    var uploadBlobResponse = await blockBlobClient2.upload(data, data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
};