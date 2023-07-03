import { User } from '../src/models/DataTypes'
import { supabase } from '../lib/supabase'
import { UserInfo } from '../src/models/DataTypes'
import * as argon2 from 'argon2'

class UserService {
  async register(name: string, password: string): Promise<UserInfo[] | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck?.length != 0) {
      throw new Error('Use different username')
    }
    const hash = await argon2.hash(password)
    const user = { username: name, password_hash: hash }
    const { data, error } = await supabase.from('users').insert(user).select('id,username')
    return data
  }

  async login(name: string, password: string): Promise<UserInfo[] | null> {
    const usercheck = await this.findByUsername(name)
    if (usercheck == null) {
      return null
    }
    if (usercheck.length == 0) {
      throw new Error('User not found')
    }
    if (await argon2.verify(usercheck[0]['password_hash'], password)) {
      const user_filtered = [{ id: usercheck[0].id, username: usercheck[0].username }]
      console.log('user verified')
      return user_filtered
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
        const user_filtered = [{ id: data[0].id, username: data[0].username }]
        return user_filtered
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
}

export default UserService
