import {
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { USER_CLIENT_PROVIDER } from '../constants';
import { Axios } from 'axios';
import { UserDto } from '../../dto/create-user.dto';

@Injectable()
export class UserClientService implements OnModuleInit {
  constructor(
    @Inject(USER_CLIENT_PROVIDER) private readonly userClient: Axios,
  ) {}

  async onModuleInit() {
    this.userClient.interceptors.response.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async createUser(payload: UserDto) {
    const result = await this.userClient.post('user', payload);
    return result.data;
  }

  async getUser() {
    const result = await this.userClient.get('user');
    return result.data;
  }

  async getUserById(id: string) {
    const result = await this.userClient.get(`user/${id}`);
    return result.data;
  }

  async deleteByUserId(id: string) {
    const result = await this.userClient.delete(`user/${id}`);
    return result.data;
  }
}
