import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsOptional()
    avatar?: string;
}