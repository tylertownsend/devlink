import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  date: mongoose.Date;
}

export const UserModel = mongoose.model('user', UserSchema);