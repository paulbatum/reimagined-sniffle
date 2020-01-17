const { ServiceBusClient } = require("@azure/service-bus");
const connectionString = process.env.SalesTopicConnection;
const topicName = "Sales";
const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
const topicClient = sbClient.createTopicClient(topicName);
const topicClientSender = topicClient.createSender();

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array}`);
    var topicMessagesArray = [];
    for (var index = 0; index < eventHubMessages.length; index++) {
        var message = eventHubMessages[index];
        context.log(`Processed message ${message}`);
        var parsedMessage = message.header;
        var topicMessage = {
            body: JSON.stringify(parsedMessage),
            label: `test`,
            userProperties: {
                TotalCost: parseFloat(parsedMessage.totalCost)
            }
        };
        topicMessagesArray.push(topicMessage);
    }
    await topicClientSender.sendBatch(topicMessagesArray);
    context.bindings.salesOutput = eventHubMessages;
};