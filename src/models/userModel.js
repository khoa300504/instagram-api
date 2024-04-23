import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  displayName: Joi.string().min(6).max(20).required().trim().strict(),
  username: Joi.string().min(8).max(16).required().alphanum().trim().strict(),
  email: Joi.string().min(17).max(25).required().trim().strict(),
  password: Joi.string().required().trim().strict(),
  bio: Joi.string().min(3).max(256).trim().strict().default(null),
  userPic: Joi.string().trim().strict().default('https://firebasestorage.googleapis.com/v0/b/bookingticketapp-4194d.appspot.com/o/userPicDefault.jpg?alt=media&token=db698a11-86fb-4029-8f83-a872438b4903'),
  follower: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  following: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const getProfile = async (userId) => {
  try {
    const projection = { password: 0, updatedAt: 0 }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne(
      { _id: new ObjectId(userId) },
      { projection: projection }
    )
    return result
  } catch (error) {throw new Error(error)}
}

const createNew = async (userData) => {
  try {
    const validData = await validateBeforeCreate(userData)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {throw new Error(error)}
}

const findOneById = async (_id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(_id) })
  } catch (error) {throw new Error(error)}
}

const findPasswordByUser = async (username) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username: username })
  } catch (error) {throw new Error(error)}
}

const findExist = async (userData) => {
  try {
    const query = { username: userData?.username, email: userData?.email }
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      $or: [{ 'email': query.email }, { 'username': query.username }]
    })
  } catch (error) {throw new Error(error)}
}

const findLogged = async (_id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne(
      { _id: new ObjectId(_id) },
      { projection: { password: 0 } }
    )
  } catch (error) {throw new Error(error)}
}

const pullFollow = async (followedId, followerId) => {
  try {
    const result1 = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(followedId) },
      { $pull: { follower: new ObjectId(followerId) } },
      { returnDocument: 'after' }
    )
    const result2 = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(followerId) },
      { $pull: { following: new ObjectId(followedId) } },
      { returnDocument: 'after' }
    )
    return result1 && result2
  } catch (error) {throw new Error(error)}
}

const pushFollow = async (followedId, followerId) => {
  try {
    const result1 = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(followedId) },
      { $push: { follower: new ObjectId(followerId) } },
      { returnDocument: 'after' }
    )
    const result2 = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(followerId) },
      { $push: { following: new ObjectId(followedId) } },
      { returnDocument: 'after' }
    )
    return result1 && result2
  } catch (error) {throw new Error(error)}
}

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach(field => {
      if (INVALID_UPDATE_FIELDS.includes(field))
        delete updateData[field]
    })
    const result = GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {throw new Error(error)}
}

export const userModel = {
  getProfile,
  createNew,
  findOneById,
  findExist,
  findPasswordByUser,
  findLogged,
  pullFollow,
  pushFollow,
  update
}