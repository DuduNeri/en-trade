export interface UserCreationAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string,
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role:string
}
