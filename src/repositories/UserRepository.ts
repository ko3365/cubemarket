import { UserInfo } from '../models/DataTypes'
import { LoginInput } from '../models/DataTypes'
import { supabase } from '../../lib/supabase'
import { UserWithCookie } from '../models/DataTypes'
import UserService from '../../services/UserService'
const userService = new UserService()

class UserRepository {
  async register(params: LoginInput): Promise<UserWithCookie | null> {
    return userService.register(params['username'], params['password'])
  }
  async login(params: LoginInput): Promise<UserWithCookie | null> {
    return userService.login(params['username'], params['password'])
  }

  async delete(params: LoginInput) {
    return userService.delete(params['username'], params['password'])
  }

  async findAll(): Promise<UserInfo[] | null> {
    //return this.items
    const { data, error } = await supabase.from('users').select('id,username')
    return data
  }
}

export default UserRepository
