import { User } from '../models/DataTypes'
type UserWithoutId = Omit<User, 'id'>
type loginInput = { username: string; password: string }
//type UserWithoutIDandPwd = Omit<User, 'id' | 'password_hash'>
import { supabase } from '../../lib/supabase'
import UserService from '../../services/UserService'
const userService = new UserService()

class UserRepository {
  async register(params: loginInput) {
    userService.register(params['username'], params['password'])
  }
  async login(params: loginInput) {
    return userService.login(params['username'], params['password'])
  }
  async findAll() {
    //return this.items
    const { data, error } = await supabase.from('users').select('*')
    return data
  }
}

export default UserRepository
