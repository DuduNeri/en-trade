import { Controller, Get, Post, Body, Param, Query, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from '../auth/decorators/is-public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  } userWithoutPassword

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllUsers(@Query() data: GetUsersDto) {
    return await this.userService.findAllUsers(data);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Get('name/:name')
  @UseGuards(AuthGuard)
  async getUserByName(@Param('name') name: string) {
    return await this.userService.findUserByName(name);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.excludeUser(id);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}