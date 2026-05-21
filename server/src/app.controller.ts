import { Controller, Get } from '@nestjs/common';

@Controller("/cat")
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello cats';
  }
}