import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { postRoutes } from './postRoute'
import { userRoutes } from './userRoute'
import { messagesRoute } from './messageRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Server is ready to use' })
})

Router.use('/posts', postRoutes)

Router.use('/users', userRoutes)

Router.use('/messages', messagesRoute)

export const APIs_V1 = Router