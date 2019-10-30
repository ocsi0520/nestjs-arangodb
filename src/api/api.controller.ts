import {
  Controller,
  Request,
  Response,
	Post,
	UseGuards,
	Get,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
	Body,
	HttpCode } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IUser } from '../models/user.model'
import * as bcrypt from 'bcrypt'
import { UserService } from '../database/user/user.service'
import { AuthService } from '../auth/auth.service'
import { ACCESS_TOKEN } from '../auth/auth.constants'
import { FastifyReply } from 'fastify'
import { Http2ServerResponse } from 'http2'
const saltRounds = 10

@Controller('api')
export class ApiController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}

  @Get('myProfile')
  @UseGuards(AuthGuard('jwt'))
  getMyProfile() {
    throw new HttpException('TODO: getMyProfile', HttpStatus.NOT_IMPLEMENTED)
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true, validationError: { target: false, value: false } }))
  async register(@Body() registerRequest: IUser) {
    // TODO: instead of reaching the DB twice, we should just create a user function
    // (stored procedure in SQL) in order to register the user
    const previousUsers = await this.userService.findUserByUsername(registerRequest.username)

    if (previousUsers.hasNext()) {
      throw new HttpException(`A user is already defined with username ${registerRequest.username}`, HttpStatus.CONFLICT)
    }

    const hashedPassword = await bcrypt.hash(registerRequest.password, saltRounds)
    const userToSave = { ...registerRequest, password: hashedPassword }
    const { _id, _key, _rev }: { _id: string, _key: string, _rev: string } = await this.userService.addUser(userToSave)
  }

  @Post('/login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('local'))
  async login(@Request() { user }: { user: IUser }, @Response() reply: FastifyReply<Http2ServerResponse>) {
    const { access_token } = await this.authService.createTokenFromUser(user)
    reply.setCookie(ACCESS_TOKEN, access_token, {
      httpOnly: true,
      maxAge: 60,
      // secure: true // https://www.npmjs.com/package/cookie#options-1 || uncomment when https is on
    }).send()
  }
}
