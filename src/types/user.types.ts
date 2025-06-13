export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface User2 {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface UserProfile {
  username: string
  email?: string
  joinDate?: string
  location?: string
  bio?: string
}

export type UserList = User[];