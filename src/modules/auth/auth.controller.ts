import {Controller, Post, Body, Get, Query } from '@nestjs/common';
import {SignInService } from './services/singin.service';
import { SignInDto } from './dtos/singin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('signin')
  async signIn(@Body() data: SignInDto) {
    return await this.signInService.signIn(data);
  }
}