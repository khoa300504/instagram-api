import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidations'
import protectRoute from '~/middlewares/protectRoute'

const Router = express.Router()

Router.route('/')
  .get(protectRoute, userController.getUserForSideBar)

Router.route('/suggest')
  .get(protectRoute, userController.getSuggestUser)

Router.route('/profile/:id')
  .get(userController.getProfile)

Router.route('/signup')
  .post(userValidation.signUp, userController.signUp)

Router.route('/signin')
  .post(userValidation.signIn, userController.signIn)

Router.route('/logout')
  .post(userController.logout)

Router.route('/follow/:id')
  .put(protectRoute, userController.followUnfollow)

Router.route('/update/:id')
  .put(protectRoute, userValidation.updateProfile, userController.updateProfile)

Router.route('/feed')
  .get(protectRoute, userController.getFeed)

export const userRoutes = Router