import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserClientService } from './user-client.service';
import { USER_CLIENT_PROVIDER } from '../constants';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    UserClientService,
    {
      provide: USER_CLIENT_PROVIDER,
      useFactory: (configService: ConfigService) => {
        return axios.create({
          baseURL: configService.get('ENDPOINT_USER_SERVICE'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [UserClientService],
})
export class UserClientModule {}
