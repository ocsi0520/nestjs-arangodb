import { Controller, Get, HttpException, HttpStatus, Post, Body, ValidationPipe, UsePipes, OnModuleInit } from '@nestjs/common'
import { IUser } from './api.dto'
import { DatabaseService } from '../database/database.service'
import * as bcrypt from 'bcrypt'
import { DocumentCollection, aql } from 'arangojs'
const saltRounds = 10

@Controller('api')
export class ApiController implements OnModuleInit {
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
  @Get()
  getMyProfile() {
    throw new HttpException('TODO: getMyProfile', HttpStatus.NOT_IMPLEMENTED)
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true, validationError: { target: false, value: false } }))
  async register(@Body() registerRequest: IUser) {
    // TODO: instead of reaching the DB twice, we should just create a user function
    // (stored procedure in SQL) in order to register the user
    const previousUsers = await this.findUserByUsername(registerRequest.username)

    if (previousUsers.hasNext()) {
      throw new HttpException(`A user is already defined with username ${registerRequest.username}`, HttpStatus.CONFLICT)
    }

    const hashedPassword = await bcrypt.hash(registerRequest.password, saltRounds)
    const userToSave = { ...registerRequest, password: hashedPassword }
    const { _id, _key, _rev }: { _id: string, _key: string, _rev: string } = await this.usersCollection.save(userToSave)
  }

  // TODO: put this into a new provider
  findUserByUsername(username: string) {
    return this.databaseService.database.query(aql`
    FOR user IN users
    FILTER user.username == ${username}
    RETURN user`)
  }
}
