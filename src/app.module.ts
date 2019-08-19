import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiController } from './api/api.controller'
import { DatabaseService } from './database/database.service'

@Module({
  imports: [],
  controllers: [AppController, ApiController],
  providers: [AppService, DatabaseService]
})
export class AppModule {}
