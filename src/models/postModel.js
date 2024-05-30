import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const POST_COLLECTION_NAME = 'posts'
const POST_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().trim().strict(),
  postPic: Joi.string().required().trim().strict(),

  likes: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // comments: Joi.array().items({
  //   userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  //   content: Joi.string().trim().strict(),
  //   userPic: Joi.string().trim().strict(),
  //   createdAt: Joi.date().timestamp('javascript').default(Date.now)
  // }).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await POST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findOneById = async (postId) => {
  try {
    return await GET_DB().collection(POST_COLLECTION_NAME).findOne({ _id: new ObjectId(postId) })
  } catch (error) {throw new Error(error)}
}

const findManyById = async (userIds) => {
  try {
    return await GET_DB().collection(POST_COLLECTION_NAME).aggregate([
      {
        $match: {
          userId: { $in: userIds }
        }
      }
    ]).toArray()
  } catch (error) {throw new Error(error)}
}

const findAllById = async (userId) => {
  try {
    return await GET_DB().collection(POST_COLLECTION_NAME).find({ userId: new ObjectId(userId) }).toArray()
  } catch (error) {throw new Error(error)}
}

const createNew = async (userId, postData) => {
  try {
    const validData = await validateBeforeCreate({ userId: userId.toString(),
      description: postData.description,
      postPic: postData.postPic
    })
    validData.userId = new ObjectId(validData.userId)
    return await GET_DB().collection(POST_COLLECTION_NAME).insertOne(validData)
  } catch (error) {throw new Error(error)}
}

const deleteOneById = async (postId) => {
  try {
    await GET_DB().collection(POST_COLLECTION_NAME).deleteOne({ _id: new ObjectId(postId) })
    return 'This post has been deleted'
  } catch (error) {throw new Error(error)}
}

const pullLike = async (postId, userId) => {
  try {
    const result = await GET_DB().collection(POST_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $pull: { likes: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {throw new Error(error)}
}

const pushLike = async (postId, userId) => {
  try {
    const result = await GET_DB().collection(POST_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $push: { likes: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {throw new Error(error)}
}

// const pushReply = async (postId, user, replyContent) => {
//   try {
//     const replyData = {
//       userId: new ObjectId(user._id),
//       content: replyContent,
//       userPic: user.userPic,
//       createdAt: Date.now()
//     }
//     const result = await GET_DB().collection(POST_COLLECTION_NAME).findOneAndUpdate(
//       { _id: new ObjectId(postId) },
//       { $push: { comments: replyData } },
//       { returnDocument: 'after' }
//     )
//     return result
//   } catch (error) {throw new Error(error)}
// }

// const pullReply = async (postId, user, replyContent) => {
//   try {
//     const replyData = {
//       userId: new ObjectId(user._id),
//       content: replyContent,
//       userPic: user.userPic,
//       createdAt: Date.now()
//     }
//     const result = await GET_DB().collection(POST_COLLECTION_NAME).findOneAndUpdate(
//       { _id: new ObjectId(postId) },
//       { $pull: { comments: replyData } },
//       { returnDocument: 'after' }
//     )
//     return result
//   } catch (error) {throw new Error(error)}
// }

export const postModel = {
  findOneById,
  createNew,
  deleteOneById,
  pushLike,
  pullLike,
  // pushReply,
  findManyById,
  findAllById
  // pullReply
}