import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UserClientService } from './shared_modules/user-client/user-client.service';

@Injectable()
export class AppService {
  constructor(private readonly userClient: UserClientService) {}
  async createUser(createUserDto: UserDto) {
    const result = await this.userClient.createUser(createUserDto);
    return result;
  }

  async getUser() {
    const result = await this.userClient.getUser();
    return result;
  }

  async getUserById(id: string) {
    const result = await this.userClient.getUserById(id);
    return result;
  }

  async deleteUserById(id: string) {
    const result = await this.userClient.deleteByUserId(id);
    return result;
  }
}
