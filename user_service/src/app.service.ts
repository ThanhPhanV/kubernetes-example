import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  users = [];
  constructor(private readonly configService: ConfigService) {}
  async createUser(createUserDto: UserDto) {
    this.users.push(createUserDto);
    return createUserDto;
  }

  async getUser() {
    return this.users;
  }

  async getUserById(id: string) {
    return this.users.find((item) => item.id === id) || null;
  }

  async deleteByUserId(id: string) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index < 0) {
      return {
        count: 0,
      };
    }

    this.users.splice(index, 1);
    return {
      count: 1,
    };
  }
}
