const express = require('express');
const app = express();
require('dotenv').config();
const {connection} = require('./config/db');
const { router } = require('./routes/EmailRoute');

app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json('backend running');
});

app.listen(process.env.PORT||8000, async () => {
  try {
    await connection;
    console.log('Connected to the database');
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
