// kafkaConsumer.js
const { Kafka } = require('kafkajs');
const taskController = require('../controller/task');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'your-client-id',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'task-service' });

exports.runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'create-task' });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          await taskController.addTask(payload);
        } catch (error) {
          console.error('[Consumer] Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('[Consumer] Error connecting to Kafka:', error);
  }
};

// Handle SIGTERM signal to gracefully close the consumer on process termination
process.on('SIGTERM', async () => {
  await consumer.disconnect();
  process.exit(0);
});
