export interface UserCreationAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
