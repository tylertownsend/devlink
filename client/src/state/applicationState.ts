type ApplicationState = {
  alert: Array<AlertState>
  auth: AuthState; 
  post: ApplicationPostState;
  profile: ApplicationProfileState;
}

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: UserState | null;
}

export type ApplicationPostState = {
  posts: Array<PostState>;
  post: PostState | null;
  loading: boolean;
  error?: any;
}

export type ApplicationProfileState = {
  loading: boolean;
  profile: ProfileState | null;
  profiles: Array<ProfileState>;
  repos: Array<any>;
  error?: any;
}

export type AlertState = {
  msg: string;
  alertType: string;
  id: string;
}

export type PostState = {
  __v: number;
  /**
   * Unique id associated with the post
   */
  _id: string;
  avatar: string;
  comments: Array<CommentState>;
  likes: Array<LikeState>;
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

export type CommentState = {
  /**
   * The unique of comment entry
   */
  _id: string;
  /**
   * The unique id associated with a user entry ((u as UserState)._id)
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

export type LikeState = {
  /**
   * The unique id associated with this like entry.
   */
  _id: string;
  /**
   * The unique id associated with a user
   */
  user: string;
}

export type ProfileState = {
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
  user: UserState;
}

export type UserState = {
  _id: string;
  avatar: string;
  name: string;
}

export default ApplicationState;