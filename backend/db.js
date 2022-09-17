const mongoose = require('mongoose');
const config = require('config');
console.log(config);
const db = config.get('mongoUri');
console.log(db);

const connectDB = async() => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true
    });
    console.log('MongoDB connected ...');
  } catch (err) {
    console.error('Unable to connect to database');
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;