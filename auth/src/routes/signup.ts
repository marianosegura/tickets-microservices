import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors';
import { User } from '../models';
import { validateRequest } from '../middlewares';
import jwt from 'jsonwebtoken';


const router = express.Router();

const validators = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
];


router.post('/api/users/signup', 
  validators, 
  validateRequest, 
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`\nSigning up user ${email}...`);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log(`Failed: User ${email} already exists!`);
      throw new BadRequestError('Email in use');
    }
    
    const user = User.build({ email, password });
    
    try {
      await user.save();  // save user to db
      
      const jwtKey = process.env.JWT_KEY;
      const userJwt = jwt.sign({ id: user.id, email: user.email }, jwtKey!);  // create jwt
      req.session = { jwt: userJwt };  // attach jwt as cookie session

      console.log(`User ${email} signed up!`);
      res.status(201).send(user);

    } catch (error) {
      console.log(`Failed to save user!`);
      throw new BadRequestError('Failed to save user');
    }
});


export { router as signupRouter };
