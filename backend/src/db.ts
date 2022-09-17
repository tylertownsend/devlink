import * as mongoose from 'mongoose';
import * as config from 'config';

console.log(config);
const db: string = config.get('mongoUri');
console.log(db);

export const connectDB = async() => {
  try {
    await mongoose.connect(db, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true
    });
    console.log('MongoDB connected ...');
  } catch (err) {
    console.error('Unable to connect to database');
    console.log(err);
    process.exit(1);
  }
};