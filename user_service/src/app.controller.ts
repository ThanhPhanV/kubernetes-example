import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('user')
  createUser(@Body() createUserDto: UserDto) {
    const payload = {
      id: v4(),
      ...createUserDto,
    };
    return this.appService.createUser(payload);
  }

  @Get('user')
  getUser() {
    return this.appService.getUser();
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  @Delete('user/:id')
  deleteByUserId(@Param('id') id: string) {
    return this.appService.deleteByUserId(id);
  }
}
