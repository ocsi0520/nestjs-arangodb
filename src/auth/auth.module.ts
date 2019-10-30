import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../database/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_PASSWORD || 'default',
      signOptions: { expiresIn: '3600s' }
    })
  ],
  providers: [ AuthService, LocalStrategy, JwtStrategy ],
  exports: [ AuthService ]
})
export class AuthModule {}
