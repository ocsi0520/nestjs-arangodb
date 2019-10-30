import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { JwtPayload } from '../models/jwt-payload.model'
import { ACCESS_TOKEN } from './auth.constants'

const cookieExtractor = function(req) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies[ACCESS_TOKEN]
  }

  console.info(token)
  return token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // TODO: handle jwt with asymmetric key
  // https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_PASSWORD || 'default',
    })
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username }
  }
}
