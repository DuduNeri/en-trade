import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  testConnect() {
    return {
      message: 'Conexão com a API funcionando!',
      status: true,
    };
  }
}