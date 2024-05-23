import { StatusCodes } from 'http-status-codes'
import { postService } from '~/services/postService'

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPost(req.params.id)
    res.status(StatusCodes.OK).json(post)
  } catch (error) { next(error) }
}

const getUserPost = async (req, res, next) => {
  try {
    const userPosts = await postService.getUserPost(req.params.id)
    res.status(StatusCodes.OK).json(userPosts)
  } catch (error) { next(error) }
}

const CreateNew = async (req, res, next) => {
  try {
    const newPost = await postService.CreateNew(req.user._id, req.body)
    res.status(StatusCodes.OK).json(newPost)
  } catch (error) { next(error) }
}

const DeletePost = async (req, res, next) => {
  try {
    const result = await postService.DeletePost(req.user._id, req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const LikeUnlike = async (req, res, next) => {
  try {
    const result = await postService.LikeUnlike(req.user._id, req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// const AddReply = async (req, res, next) => {
//   try {
//     const newReply = await postService.AddReply(req.user, req.body, req.params.id)
//     res.status(StatusCodes.OK).json(newReply)
//   } catch (error) { next(error) }
// }

// const DeleteReply = async (req, res, next) => {
//   try {
//     const result = await postService.DeleteReply(req.user, req.params.id)
//     res.status(StatusCodes.OK).json(result)
//   } catch (error) { next(error) }
// }

export const postController = {
  getPost,
  CreateNew,
  DeletePost,
  LikeUnlike,
  getUserPost
  // AddReply,
  // DeleteReply
}