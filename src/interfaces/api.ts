export interface User {
  uid: string;
  login: string;
  nickname: string;
}

export interface UserAccessToken {
  token: string;
  owner?: User;
}

export interface AuthCode {
  code: string;
  scope: string;
}

export interface Configuration {
  version: string;
  content: string;
}

export interface Comment {
  id: number;
  createdAt: string;
  content: string;
  from: User;
  to: User;
}
