import { Length, IsString, IsIn, IsDate } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseModel } from './base.model'

export class IUser extends BaseModel {
  @IsString()
  @Length(3, 30)
  username: string

  @IsString()
  @Length(8, 30)
  password: string

  @IsString()
  @Length(3, 30)
  name: string

  @IsIn(['male','female','unknown'])
  gender: 'male' | 'female' | 'unknown'

  @IsDate()
  @Type(() => Date)
  birthDate: Date
}
