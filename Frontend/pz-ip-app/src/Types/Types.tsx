export type User = {
  id: Number;
  username: String;
  email: String;
  dateJoined: any;
  lastLogin: any;
  isActive: Boolean;
};
export type Token = {
  tokenAuth: {
    token: String;
  };
};
