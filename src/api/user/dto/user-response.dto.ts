import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  avatar?: string;

  @Exclude() 
  password!: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}