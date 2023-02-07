import express, { Express, Request, Response, Router } from 'express'
import { createUser, checkIfUserExists} from '../services/user.service'
// const app: Express = express()
let router: Router = express.Router()

//Create a User
router.post('/signup', async (req: Request, res: Response) => {
    const userData = req.body
    const userExists = await checkIfUserExists(userData.userName);
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
    }else{
      createUser(userData);
      res.status(201).json({ message: 'User created', data: userData});
    }
})

router.get('/signup', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Signup page' })
})

module.exports = router