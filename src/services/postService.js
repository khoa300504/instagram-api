import { StatusCodes } from 'http-status-codes'
import { postModel } from '~/models/postModel'
import ApiError from '~/utils/ApiError'
import { app, storage } from '~/config/firebase'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const getPost = async (reqParamsId) => {
  try {
    const postId = reqParamsId
    return await postModel.findOneById(postId)
  } catch (error) { throw error }
}

const getUserPost = async (reqParamsId) => {
  try {
    const userId = reqParamsId
    return await postModel.findAllById(userId)
  } catch (error) { throw error }
}

const CreateNew = async (reqUserId, reqBody) => {
  try {
    const postId = reqUserId
    const postData = reqBody
    // const postPic = postData.postPic
    const newPost = await postModel.createNew(postId, postData)
    return await postModel.findOneById(newPost.insertedId)
  } catch (error) { throw error }
}

const DeletePost = async (reqUserId, reqParams) => {
  try {
    const userId = reqUserId
    const postId = reqParams
    //Xu li param con nua
    const ownerId = (await postModel.findOneById(postId)).userId
    const isOwner = ownerId.equals(userId)
    if (!isOwner) throw new ApiError(StatusCodes.BAD_REQUEST, 'You can not delete post not yours')
    return await postModel.deleteOneById(postId)
  } catch (error) { throw error }
}

const LikeUnlike = async (reqUserId, reqParams) => {
  try {
    const userId = reqUserId
    const postId = reqParams
    const isLiked = (await (postModel.findOneById(postId))).likes.some(id => id.equals(userId))
    if (!isLiked)
    {
      await postModel.pushLike(postId, userId)
      return 'Liked'
    }
    else
    {
      await postModel.pullLike(postId, userId)
      return 'Unliked'
    }
  } catch (error) { throw error }
}

// const AddReply = async (reqUser, reqBody, reqParams) => {
//   try {
//     const postId = reqParams
//     const replyContent = reqBody.content
//     const user = reqUser
//     const newReply = await postModel.pushReply(postId, user, replyContent)
//     return newReply
//   } catch (error) { throw error }
// }

// const DeleteReply = async (reqUser, reqBody, reqParams) => {
//   try {
//     const postId = reqParams
//     const ownerId = await postModel.findOnwerReply()
//     const replyContent = reqBody.content
//     const user = reqUser
//     if (user._id.equals(new ObjectId()))
//     const newReply = await postModel.pullReply(postId, user, replyContent)
//     return newReply
//   } catch (error) { throw error }
// }

export const postService = {
  getPost,
  CreateNew,
  DeletePost,
  LikeUnlike,
  getUserPost
  // AddReply,
  // DeleteReply
}