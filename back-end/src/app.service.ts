import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { Axios } from 'axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private axiosInstance: Axios;
  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('ENDPOINT_USER_SERVICE'),
    });
  }
  async createUser(createUserDto: UserDto) {
    const result = await this.axiosInstance.post('user', createUserDto);
    return result;
  }

  async getUser() {
    const result = await this.axiosInstance.get('user');
    return result;
  }

  async getUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result;
  }

  async deleteUserById(id: string) {
    const result = await this.axiosInstance.get(`user/:${id}`);
    return result;
  }
}
