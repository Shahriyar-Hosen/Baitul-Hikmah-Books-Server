export type IUserAuth = {
  email: string;
  password: string;
};

export type IJWTResponse = {
  accessToken: string;
  refreshToken?: string;
};
