import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { UserInfo } from '../models/DataTypes'

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

export function generateAccessToken(user: UserInfo) {
  const token = jwt.sign(user, jwtKey)
  return token
}

export function verifyAccessToken(token: string | undefined) {
  if (token === undefined) {
    throw new Error('unauthorized')
  }
  const payload = jwt.verify(token, jwtKey)
  return payload
}
