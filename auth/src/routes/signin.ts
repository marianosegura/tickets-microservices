import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@lmrstickets/common';
import { User } from '../models';
import { PasswordManager } from '../utils';
import jwt from 'jsonwebtoken';


const router = express.Router();

const validators = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
];


router.post('/api/users/signin', 
  validators, 
  validateRequest, 
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`\nSigning in user ${email}...`);

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log(`Failed: User ${email} doesn't exists!`);
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordManager.compare(user.password, password);
    if (!passwordsMatch) {
      console.log(`Failed: Password for ${email} don't match!`);
      throw new BadRequestError('Invalid credentials');
    }

    const jwtKey = process.env.JWT_KEY;
    const userJwt = jwt.sign({ id: user.id, email: user.email }, jwtKey!);  // create jwt
    req.session = { jwt: userJwt };  // attach jwt as cookie session
    
    console.log(`User ${email} signed in!`);
    res.status(200).send(user);
});


export { router as signinRouter };
