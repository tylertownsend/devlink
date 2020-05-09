const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoUri');

const connectDB = async() => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('MongoDB connected ...');
  } catch (err) {
    console.error('Unable to connect to database');
    process.exit(1);
  }
};

module.exports = connectDB;