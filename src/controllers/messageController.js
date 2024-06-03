import { StatusCodes } from 'http-status-codes'
import { messageService } from '~/services/messageService'
import { getReceiverSocketId, io } from '~/socket/socket'

const sendMessage = async (req, res, next) => {
  try {
    const newMessage = await messageService.sendMessage(req.user._id, req.params.id, req.body.message)
    const receiverSocketId = getReceiverSocketId(req.params.id)
    if (receiverSocketId) io.to(receiverSocketId).emit('newMessage', newMessage)
    res.status(StatusCodes.OK).json(newMessage)
  } catch (error) { next(error) }
}

const getMessages = async (req, res, next) => {
  try {
    const listMessages = await messageService.getMessages(req.user._id, req.params.id)
    res.status(StatusCodes.OK).json(listMessages)
  } catch (error) { next(error) }
}

export const messageController = {
  sendMessage,
  getMessages
}