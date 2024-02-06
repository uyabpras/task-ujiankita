const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const app = express();
const taskRoute = require('./routes/routing');
const { createTask, updateTask } = require('./config/kafka'); 

app.use(express.json());
const port = 3099;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/task', taskRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const db = require('./db/connect');
db.sequelize.sync({alter: true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.listen(port, () => {
  console.log(`Example app listening on port localhost:${port}/api-docs`);
})

// Jalankan produsen Kafka
Promise.all([createTask(), updateTask()])
  .then(() => {
    console.log('All Kafka producers connected and sent messages.');
  })
  .catch((error) => {
    console.error('Error connecting to Kafka:', error);
  });