import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.author
    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

    const user = await userModel.findLogged(decode.userId)

    req.user = user

    next()
  } catch (error) {next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error in sign up'))}
}

export default protectRoute