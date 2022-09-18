type ApplicationState = {
  alert: Array<any>
  auth: {
    token: string;
    isAuthenticated: boolean;
    loading: boolean;
    user: User;
  }
  post: {
    posts: Array<Post>;
    post: Post;
    loading: boolean;
  }
  profile: {
    loading: boolean;
    profile: Profile;
    profiles: Array<Profile>;
    repo: Array<any>;
  }
}

type Post = {
  __v: number;
  /**
   * Unique id associated with the post
   */
  _id: string;
  avatar: string;
  comments: Array<Comment>;
  likes: Array<Like>;
  /**
   * Name of the user who posted;
   */
  name: string;
  text: string;
  /**
   * The unique id for the user entry
   */
  user: string;
}

type Comment = {
  /**
   * The unique of comment entry
   */
  _id: string;
  /**
   * The unique id associated with a user entry ((u as User)._id)
   */
  user: string;
  /**
   * Text in comment
   */
  text: string;
  /**
   * Name of user
   */
  name: string;
  /**
   * Datetime string of when comment was created
   */
  date: string;
  /** the image for the user */
  avatar: string;
}

type Like = {
  /**
   * The unique id associated with this like entry.
   */
  _id: string;
  /**
   * The unique id associated with a user
   */
  user: string;
}

type Profile = {
  __v: number;
  /**
   * Unique id provided for each entry
   */
  _id: string;
  bio: string;
  company: string;
  date: string;
  education: any;
  experience: any;
  skils: Array<string>;
  status: string;
  user: User;
}

type User = {
  _id: string;
  avatar: string;
  name: string;
}

export default ApplicationState;