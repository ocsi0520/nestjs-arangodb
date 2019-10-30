import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiController } from './api/api.controller'
import { DatabaseService } from './database/database.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './database/user/user.module'

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, ApiController],
  providers: [AppService, DatabaseService]
})
export class AppModule {}
