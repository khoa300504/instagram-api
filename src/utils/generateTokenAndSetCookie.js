import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d'
  })

  res.cookie('author', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  })

  return token
}

export default generateTokenAndSetCookie