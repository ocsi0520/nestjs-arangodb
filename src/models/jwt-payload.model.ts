export interface JwtPayload {
  username: string
  sub: any // this is a subset of the IUser
}
