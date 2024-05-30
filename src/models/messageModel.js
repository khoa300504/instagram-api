import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MESSAGE_COLLECTION_NAME = 'messages'
const CONVERSATION_COLLECTION_NAME = 'conversations'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  conversationId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  senderId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  receiverId: Joi.string().required().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  message: Joi.string().required().min(1).strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await MESSAGE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findOneMessageById = async (messageId) => {
  const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).findOne({ _id: new ObjectId(messageId) })
  return result || null
}

const checkExistConversation = async (participants) => {
  try {
    let conversation = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOne({ participants: participants })
    if (!conversation)
    {
      const temp = participants[0]
      participants[0] = participants[1]
      participants[1] = temp
      conversation = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOne({ participants: participants })
      if (conversation) return conversation._id
      const newConversation = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).insertOne({ participants: participants, messages: [] })
      return newConversation.insertedId
    }
    return conversation._id
  } catch (error) {throw new Error(error)}
}

const createNewMessage = async (senderId, receiverId, message, conversationId) => {
  try {
    const validData = await validateBeforeCreate({ conversationId: conversationId.toString(), senderId: senderId.toString(), receiverId: receiverId.toString(), message: message })
    validData.conversationId = new ObjectId(validData.conversationId)
    validData.senderId = new ObjectId(validData.senderId)
    validData.receiverId = new ObjectId(validData.receiverId)
    const newMessageId = (await GET_DB().collection(MESSAGE_COLLECTION_NAME).insertOne(validData)).insertedId
    await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(conversationId) },
      { $push: { messages: new ObjectId(newMessageId) } },
      { returnDocument: 'after' }
    )
    return newMessageId
  } catch (error) {throw new Error(error)}
}

const getMessages = async (conversationId) => {
  return await GET_DB().collection(MESSAGE_COLLECTION_NAME).find({ conversationId: new ObjectId(conversationId) }).toArray()
}

export const messageModel = {
  createNewMessage,
  checkExistConversation,
  getMessages,
  findOneMessageById
}