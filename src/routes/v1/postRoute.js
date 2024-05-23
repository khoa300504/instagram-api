import express from 'express'
import { postController } from '~/controllers/postController'
import protectRoute from '~/middlewares/protectRoute'
import { postValidation } from '~/validations/postValidations'

const Router = express.Router()

Router.route('/:id')
  .get(postController.getPost)

Router.route('/userpost/:id')
  .get(postController.getUserPost)

Router.route('/create')
  .post(protectRoute, postValidation.CreateNew, postController.CreateNew)

Router.route('/delete/:id')
  .delete(protectRoute, postController.DeletePost)

Router.route('/like/:id')
  .put(protectRoute, postController.LikeUnlike)

// Router.route('/reply/:id')
//   .post(protectRoute, postValidation.AddReply, postController.AddReply)
//   .delete(protectRoute, postController.DeleteReply)


export const postRoutes = Router