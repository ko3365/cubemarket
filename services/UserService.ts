import { User } from '../src/models/DataTypes'
import { supabase } from '../lib/supabase'
import * as argon2 from 'argon2'

class UserService {
  register(name: string, password: string) {
    const usercheck = this.findByUsername(name)
    usercheck.then(async function (users) {
      if (users != null) {
        if (users.length != 0) {
          throw new Error('Use different username')
        }
        const hash = await argon2.hash(password)
        const user = { username: name, password_hash: hash }
        const { data, error } = await supabase.from('users').insert(user).select('*')
      }
    })

    /*
    if (usercheck === null) {
      const { data, error } = await supabase.from('users').insert(user).select('*')
      return data
    } else {
      throw new Error('Use different username')
    }
    */
  }
  async login(name: string, password: string): Promise<User[] | null | void> {
    const usercheck = this.findByUsername(name)
    usercheck.then(async function (user) {
      if (user != null) {
        if (user.length == 0) {
          throw new Error('user not found')
        }
        if (await argon2.verify(user[0]['password_hash'], password)) {
          //console.log('login success')
          return user[0]
        } else {
          return null
        }
      }
    })
  }

  async findByUsername(name: string): Promise<User[] | null> {
    const { data, error } = await supabase.from('users').select('*').eq('username', name)
    return data
  }
}

export default UserService
