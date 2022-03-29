export type User = {
  id: number;
  username: string;
  email: string;
  dateJoined: Date;
  lastLogin: Date;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
};

export type Token = {
  tokenAuth: {
    token: string;
  };
};
