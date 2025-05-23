export interface JWTPayload {
  sub: string
  username: string
  role: string
  permissions: string[]
  iat: number
  exp: number
}