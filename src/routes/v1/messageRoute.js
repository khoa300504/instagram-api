import express from 'express'
import { messageController } from '~/controllers/messageController'
import protectRoute from '~/middlewares/protectRoute'

const Router = express.Router()

Router.route('/:id')
  .get(protectRoute, messageController.getMessages)

Router.route('/send/:id')
  .post(protectRoute, messageController.sendMessage)

export const messagesRoute = Router