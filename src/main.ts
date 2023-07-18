import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const jwtKey = process.env.JWT_KEY as string

function main() {
  const user = { id: 'test', username: 'test' }
  const token = jwt.sign(user, jwtKey)
  console.log(token)
}

main()
