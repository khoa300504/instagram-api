import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const CreateNew = async (req, res, next) => {
  const corretConditions = Joi.object({
    userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().trim().strict(),
    postPic: Joi.string().trim().strict().required()
  })
  const data = {
    userId: req.user._id.toString(),
    description: req.body.description,
    postPic: req.body.postPic
  }
  try {
    await corretConditions.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

// const AddReply = async (req, res, next) => {
//   const corretConditions = Joi.object({
//     _id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
//     userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
//     content: Joi.string().trim().strict().required(),
//     userPic: Joi.string().trim().strict().required()
//   })
//   const data = {
//     _id: req.params.id,
//     userId: req.user._id.toString(),
//     content: req.body.content,
//     userPic: req.user.userPic
//   }
//   try {
//     await corretConditions.validateAsync(data, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

export const postValidation= {
  CreateNew
  // AddReply
}