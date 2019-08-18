import { Controller, Get, HttpException, HttpStatus, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common'
import { RegisterDTO } from './api.dto'

@Controller('api')
export class ApiController {
  @Get()
  getMyProfile() {
    throw new HttpException('TODO: getMyProfile', HttpStatus.NOT_IMPLEMENTED)
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true, validationError: { target: false, value: true } }))
  register(@Body() registerRequest: RegisterDTO) {
    return registerRequest
  }
}
