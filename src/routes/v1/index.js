import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { postRoutes } from './postRoute'
import { userRoutes } from './userRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Sever is ready to use' })
})

Router.use('/posts', postRoutes)

Router.use('/users', userRoutes)

export const APIs_V1 = Router