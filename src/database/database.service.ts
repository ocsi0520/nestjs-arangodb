import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Database } from 'arangojs'

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public database: Database
  initDatabase() {
    this.database = new Database()
  }
  onModuleDestroy() {
    console.info('moduleDestroy')
    this.database.close()
  }
}

// https://www.arangodb.com/docs/stable/drivers/js-reference-database.html
