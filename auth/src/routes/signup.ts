import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError, BadRequestError } from '../errors';
import { User } from '../models';
import { Password } from '../utils';


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


router.post('/api/users/signup', validators, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;
  console.log(`\nSigning up user ${email}...`);

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log(`Failed: User ${email} already exists!`);
    throw new BadRequestError('Email in use');
  }
  
  const user = User.build({ email, password });
  
  try {
    await user.save(); 
    res.status(201).send(user);

  } catch (error) {
    console.log(`Failed to save user!`);
    throw new BadRequestError('Failed to save user');
  }
});


export { router as signupRouter };
