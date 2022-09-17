import * as mongoose from 'mongoose';
import { ConstructorMapping } from '../types/constructorMapping';
import { User } from './users';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
});

export type Post = {
  user: User;
  text: string;
  name: string;
  avatar: string;
  likes: Array<User>;
  comments: Array<Comment>;
}

export type Comment = {
  user: User;
  text: string;
  name: string;
  avatar: string;
  date: mongoose.Date;
}

export const PostModel = mongoose.model('post', PostSchema);