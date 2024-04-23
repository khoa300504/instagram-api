import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidations'
import protectRoute from '~/middlewares/protectRoute'

const Router = express.Router()

Router.route('/profile/:id')
  .get(userController.getProfile)

Router.route('/signup')
  .post(userValidation.SignUp, userController.SignUp)

Router.route('/signin')
  .post(userValidation.SignIn, userController.SignIn)

Router.route('/logout')
  .post(userController.logout)

Router.route('/follow/:id')
  .put(protectRoute, userController.followUnfollow)

Router.route('/update/:id')
  .put(protectRoute, userValidation.updateProfile, userController.updateProfile)

export const userRoutes = Router