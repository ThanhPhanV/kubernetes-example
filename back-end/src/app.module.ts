import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserClientModule } from './shared_modules/user-client/user-client.module';

@Module({
  imports: [ConfigModule.forRoot(), UserClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
