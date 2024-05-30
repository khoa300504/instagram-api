import { ObjectId } from 'mongodb'
import { messageModel } from '~/models/messageModel'

const sendMessage = async (reqUserId, reqParamsId, reqBodyMessage) => {
  const senderId = reqUserId
  const receiverId = reqParamsId
  const message = reqBodyMessage
  const participants = [
    { user: new ObjectId(reqUserId) },
    { user: new ObjectId(reqParamsId) }
  ]
  try {
    const conversationId = await messageModel.checkExistConversation(participants)
    const newMessageId = await messageModel.createNewMessage(senderId, receiverId, message, conversationId)
    return await messageModel.findOneMessageById(newMessageId)
  } catch (error) { throw error }
}

const getMessages = async (reqUserId, reqParamsId) => {
  const participants = [
    { user: new ObjectId(reqUserId) },
    { user: new ObjectId(reqParamsId) }
  ]
  try {
    const conversationId = await messageModel.checkExistConversation(participants)
    const listMessages = await messageModel.getMessages(conversationId)
    return listMessages
  } catch (error) { throw error }
}

export const messageService = {
  sendMessage,
  getMessages
}