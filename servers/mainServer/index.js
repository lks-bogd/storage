const express = require('express');
const pg = require('pg');
const cors = require('cors');

const router = require('./routes/index');
const sequelize = require('./db');

const { config } = require('dotenv');
config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT = ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
}

start();