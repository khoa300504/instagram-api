import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const SignUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().min(6).max(20).required().trim().strict(),
    username: Joi.string().min(8).max(16).required().alphanum().trim().strict(),
    email: Joi.string().min(17).max(25).required().trim().strict(),
    password: Joi.string().min(8).max(16).required().trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Please check your input'))
  }
}

const SignIn = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().min(8).max(16).required().alphanum().trim().strict(),
    password: Joi.string().min(8).max(16).required().trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Please check your input'))
  }
}

const updateProfile = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().min(6).max(20).trim().strict(),
    email: Joi.string().min(17).max(25).trim().strict(),
    password: Joi.string().min(8).max(16).trim().strict(),
    bio: Joi.string().min(3).max(256).trim().strict(),
    profilePic: Joi.string().trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Please check your input'))
  }
}

export const userValidation = {
  SignUp,
  SignIn,
  updateProfile
}