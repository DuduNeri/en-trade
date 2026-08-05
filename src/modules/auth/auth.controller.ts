import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SignInService } from './services/singin.service';
import { SignInDto } from './dtos/singin.dto';
import { Public } from './decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() data: SignInDto) {
    return await this.signInService.signIn(data);
  }
}
