import express, { Express, Request, Response, Router } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import { User } from '../models/user.model'
import {
  createUser,
  checkIfUserExists,
  updateUser,
  verifyUser,
  deleteUser,
  confirmUser
} from '../services/user.service'
import { createToken, validateToken } from '../utils/jwt'

export const CreateUser = async (req: Request, res: Response) => {
  const userData = req.body
  const userExists = await checkIfUserExists(userData.email)
  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  } else {
    createUser(userData)
      .then((result) => {
        console.log('User created successfully: ', result)
        res.status(201).json({ message: 'User created', data: userData })
      })
      .catch((error) => {
        console.log('Error creating user: ', error)
        res.status(500).json({ message: 'Error creating user', error })
      })
  }
}

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if(!user) {
    console.log('User does not exist')
    res.status(401).json({ message: 'Incorrect username or password, please make sure you have confirmed your email' })
  }

  const hashedPassword = user?.local.password
  bcrypt.compare(password, hashedPassword).then((match) => {
    if (!match) {
      res.status(400).json({ error: 'Wrong username or password'})
    } else {
      const accessToken = createToken(user)
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true
      })
      res.status(200).json({ message: 'Login successful' })
    }
  })
}