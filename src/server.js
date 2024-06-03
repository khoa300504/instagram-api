/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import existHook from 'async-exit-hook'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { app, server } from '~/socket/socket'

const START_SERVER = () => {
  app.use(express.json())
  app.use(cookieParser())
  app.use(cors(corsOptions))
  // app.use(express.urlencoded({ extended: true }))

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`3. Hi ${env.AUTHOR}, Back-end server is running successfully at PORT: ${process.env.PORT}`)
    })
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Local Dev: 3. Hi ${env.AUTHOR}, Back-end server is running successfully at Host: ${env.APP_HOST} and Port: ${env.APP_PORT}`)
    })
  }

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

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
