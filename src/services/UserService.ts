import { User } from '../models/DataTypes'
import { supabase } from '../lib/supabase'
import { UserInfo } from '../models/DataTypes'
import { UserWithToken } from '../models/DataTypes'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const jwtKey = process.env.JWT_KEY as string

import { generateAccessToken } from '../lib/jwtToken'

class UserService {
  async register(name: string, password: string): Promise<UserWithToken | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck?.length != 0) {
      throw new Error('Use different username')
    }
    const hash = await argon2.hash(password)
    const user_password = { username: name, password_hash: hash }
    const { data, error } = await supabase.from('users').insert(user_password).select('id,username')
    if (!data) {
      return null
    }
    const user = { id: data[0].id, username: data[0].username }
    const token = generateAccessToken(user)

    return { user, token }
  }

  async login(name: string, password: string): Promise<UserWithToken | null> {
    const usercheck = await this.findByUsername(name)
    if (!usercheck) {
      return null
    }
    if (usercheck.length == 0) {
      throw new Error('User not found')
    }
    if (await argon2.verify(usercheck[0]['password_hash'], password)) {
      const user = { id: usercheck[0].id, username: usercheck[0].username }
      const token = generateAccessToken(user)
      console.log('user verified')
      return { user, token }
    } else {
      return null
    }
  }

  async delete(me: UserInfo): Promise<UserInfo[] | null> {
    const username = me.username
    const usercheck = await this.findByUsername(username)
    if (!usercheck) {
      return null
    } else {
      const { data, error } = await supabase.from('users').delete().eq('id', usercheck[0].id).select('*')
      return [{ id: me.id, username: me.username }]
    }
  }

  async findByUsername(name: string): Promise<User[] | null> {
    const { data, error } = await supabase.from('users').select('*').eq('username', name)
    return data
  }
}

export default UserService
