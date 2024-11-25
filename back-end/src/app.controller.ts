import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';

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
  deleteUserById(@Param('id') id: string) {
    return this.appService.deleteUserById(id);
  }
}
