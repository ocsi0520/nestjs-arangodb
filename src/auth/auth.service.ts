import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../database/user/user.service'
import { IUser } from '../models/user.model'
import { JwtPayload } from '../models/jwt-payload.model'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const userCursor = await this.userService.findUserByUsername(username)
    if (!userCursor.hasNext()) {
      return null
    }
    const user: IUser = await userCursor.next()
    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) {
      return null
    }

    user.password = undefined
    return user
  }

  async createTokenFromUser(user: IUser) {
    const payload: JwtPayload = { username: user.username, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
