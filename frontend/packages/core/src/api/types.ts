export type User = {
  id: string;
  email: string;
};

export type UserApi = {
  isLoggedIn(): Promise<boolean>;

  getUser(): Promise<User>;
};
