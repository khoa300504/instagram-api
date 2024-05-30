import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import generateTokenAndSetCookie from '~/utils/generateTokenAndSetCookie'

const getProfile = async (req, res, next) => {
  try {
    const profileData = await userService.getProfile(req.params.id)
    res.status(StatusCodes.OK).json(profileData)
  } catch (error) { next(error) }
}

const signUp = async (req, res, next) => {
  try {
    const createUser = await userService.signUp(req.body)
    generateTokenAndSetCookie(createUser._id, res)
    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) { next(error) }
}

const signIn = async (req, res, next) => {
  try {
    const user = await userService.signIn(req.body)
    generateTokenAndSetCookie(user._id, res)
    res.status(StatusCodes.OK).json(user)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' })
  } catch (error) { next(error) }
}

const followUnfollow = async (req, res, next) => {
  try {
    const result = await userService.followUnfollow(req.params.id, req.user._id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user._id, req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getFeed = async (req, res, next) => {
  try {
    const result = await userService.getFeed(req?.user?._id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getUserForSideBar = async (req, res, next) => {
  try {
    const result = await userService.getUserForSideBar(req.user._id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getSuggestUser = async (req, res, next) => {
  try {
    const result = await userService.getSuggestUser(req.user)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  signUp,
  signIn,
  logout,
  followUnfollow,
  updateProfile,
  getProfile,
  getFeed,
  getUserForSideBar,
  getSuggestUser
}