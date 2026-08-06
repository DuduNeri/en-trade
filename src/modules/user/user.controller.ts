import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSellerDto } from './dto/create-seller';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from '../auth/decorators/is-public.decorator';
import { UserRoles } from '../../enums/user-roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard) 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @Post('create-seller')
  async createUserSeller(@Body() createSellerDto: CreateUserSellerDto) {
    return this.userService.createUserSeller(createSellerDto);
  }

  @Get('all')
  @UseGuards()
  async getAllUsers(@Query() data: GetUsersDto) {
    return this.userService.findAllUsers(data);
  }

  @Get(':id')
  @UseGuards()
  @Roles(UserRoles.ADMIN)
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get('name/:name')
  @UseGuards()
  async getUserByName(@Param('name') name: string) {
    return this.userService.findUserByName(name);
  }

  @Delete('delete/:id')
  @UseGuards()
  @Roles(UserRoles.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.userService.excludeUser(id);
  }

  @Put('update/:id')
  @UseGuards()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}