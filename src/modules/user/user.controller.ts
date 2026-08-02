import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
  @Get('all')
  async getAllUsers(@Query() data: GetUsersDto) {
    return await this.userService.findAllUsers(data);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findByUser(id);
  }
}