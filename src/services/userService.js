import { userModel } from '~/models/userModel'
import bcrypt from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'

const getProfile = async (reqParamsId) => {
  try {
    const userId = reqParamsId
    return await userModel.getProfile(userId)
  } catch (error) { throw error }
}

const SignUp = async (reqBody) => {
  try {
    const userInfo = {
      ...reqBody
    }
    const user = await userModel.findExist(userInfo)
    if (user)
    {
      throw new ApiError(StatusCodes.CONFLICT, 'User already exist!')
    }

    const salt = await bcrypt.genSalt(8)
    userInfo.password = await bcrypt.hash(userInfo.password, salt)

    const createdUser = await userModel.createNew(userInfo)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  } catch (error) { throw error }
}

const SignIn = async (reqBody) => {
  try {
    const userInfo = {
      ...reqBody
    }
    const existUser = await userModel.findPasswordByUser(userInfo.username)
    if (!existUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user')
    const isPasswordCorret = await bcrypt.compare(userInfo.password, existUser.password)
    if (!isPasswordCorret) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect password')
    return existUser
  } catch (error) { throw error }
}

const followUnfollow = async (reqParams, reqUserId) => {
  const followedId = reqParams
  const followerId = reqUserId

  //nguoi duoc theo doi
  const followed = await userModel.findOneById(followedId)

  //nguoi theo doi
  const follower = await userModel.findOneById(followerId)

  if (followedId === followerId) throw new ApiError(StatusCodes.BAD_REQUEST, 'You can follow or unfollow yourself')

  if (!followed || !follower) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  let isFollowing = follower.following.some(id => id.equals(new ObjectId(followedId)))

  if (isFollowing)
  {
    await userModel.pullFollow(followedId, followerId)
    return { message: 'Unfollow successfully' }
  }
  else
  {
    await userModel.pushFollow(followedId, followerId)
    return { message: 'Follow successfully' }
  }
}

const updateProfile = async (reqUserId, reqParamsId, reqBody) => {
  try {
    const currentUserId = reqUserId
    const userUpdate = reqParamsId
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    if (currentUserId.equals(new ObjectId(userUpdate)))
    {
      await userModel.update(userUpdate, updateData)
      return { message: 'Profile update successfully!' }
    }
    return { message: 'You cannot update other profile!' }
  } catch (error) { throw error }
}

export const userService = {
  getProfile,
  SignUp,
  SignIn,
  followUnfollow,
  updateProfile
}