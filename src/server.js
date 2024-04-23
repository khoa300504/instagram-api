/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import existHook from 'async-exit-hook'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SEVER = () => {
  const app = express()

  app.use(express.json())
  // app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3.Backend server is running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  existHook(() => {
    console.log('4.Disconnecting from MongoDb Clound Atlas...')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDb Clound Atlas')
  })
}

(async () => {
  try {
    console.log('1.Connecting to MongoDB Clound Atlas...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDb Atlas!')

    START_SEVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
