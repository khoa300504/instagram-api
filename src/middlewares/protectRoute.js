import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { env } from '~/config/environment'

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')

    const decode = jwt.verify(token, env.JWT_SECRET_KEY)

    const user = await userModel.findLogged(decode.userId)

    req.user = user
    next()
  } catch (error) {next(new ApiError(StatusCodes.UNAUTHORIZED, 'Required for signed cookies'))}
}

export default protectRoute