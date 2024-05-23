import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET_KEY, {
    expiresIn: '30d'
  })

  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none'
  })

  return token
}

export default generateTokenAndSetCookie