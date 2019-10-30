import { Injectable, OnModuleInit } from '@nestjs/common'
import { DocumentCollection, aql } from 'arangojs'
import { IUser } from '../../models/user.model'
import { DatabaseService } from '../database.service'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}
  usersCollection: DocumentCollection<IUser>
  async onModuleInit() {
    this.databaseService.initDatabase()
    this.usersCollection = this.databaseService.database.collection('users')
    const isUserCollectionExists = await this.usersCollection.exists()
    if (!isUserCollectionExists) {
      await this.usersCollection.create()
      await this.usersCollection.createHashIndex('username', { unique: true })
    }
  }

  addUser(user: IUser) {
    return this.usersCollection.save(user)
  }

  findUserByUsername(username: string) {
    return this.databaseService.database.query(aql`
    FOR user IN users
    FILTER user.username == ${username}
    RETURN user`)
  }
}
