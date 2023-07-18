import { User } from '../src/models/DataTypes'
import { supabase } from '../lib/supabase'
import { UserInfo } from '../src/models/DataTypes'
import { UserWithToken } from '../src/models/DataTypes'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

class UserService {
  async register(name: string, password: string): Promise<UserWithToken | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck?.length != 0) {
      throw new Error('Use different username')
    }
    const hash = await argon2.hash(password)
    const user_password = { username: name, password_hash: hash }
    const { data, error } = await supabase.from('users').insert(user_password).select('id,username')
    if (data == null) {
      return null
    }
    const user = { id: data[0].id, username: data[0].username }
    const token = this.generateAccessToken(user)

    return { user, token }
  }

  async login(name: string, password: string): Promise<UserWithToken | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck == null) {
      return null
    }
    if (usercheck.length == 0) {
      throw new Error('User not found')
    }
    if (await argon2.verify(usercheck[0]['password_hash'], password)) {
      const user = { id: usercheck[0].id, username: usercheck[0].username }
      const token = this.generateAccessToken(user)
      console.log('user verified')
      return { user, token }
    } else {
      return null
    }
  }

  async delete(name: string, password: string): Promise<UserInfo[] | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck == null) {
      return null
    }
    if (usercheck.length == 0) {
      throw new Error('User not found')
    }
    if (await argon2.verify(usercheck[0]['password_hash'], password)) {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', usercheck[0].id)
        .select('*')
      if (data != null) {
        const user = [{ id: data[0].id, username: data[0].username }]
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  }

  async findByUsername(name: string): Promise<User[] | null> {
    const { data, error } = await supabase.from('users').select('*').eq('username', name)
    return data
  }

  generateAccessToken(user: UserInfo) {
    const token = jwt.sign(user, jwtKey)
    return token
  }
}

export default UserService
