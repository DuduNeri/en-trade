import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserRoles } from '../../enums/user-roles.enum';
import { Public } from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../upload/upload.contants';
import { CreateUserSellerDto } from './dto/create-seller';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('avatar')
  @UseGuards()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo inválido'), false);
        }
      },
    }),
  )
  async updateAvatar(
    @Req() req: any,
    @UploadedFile() avatar: Express.Multer.File,
    @User('sub') id: string,
  ) {
    console.log('content-type:', req.headers['content-type']);
    console.log('body:', req.body);
    console.log('file:', avatar);

    if (!avatar) {
      throw new BadRequestException('Envie o arquivo no campo "avatar"');
    }
    return this.userService.updateAvatar(id, avatar);
  }

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
