import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, requireAuth, validateRequest } from '@lmrstickets/common';
import { Ticket } from '../models';


const router = express.Router();

const validators = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title must be valid'),
  body('price')
    .isFloat({ gt: 0 })  
    .withMessage('Price must be greater than 0')
];


router.post('/api/tickets', requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  console.log(`\nCreating ticket (${title}-$${price})...`);
  
  const ticket = Ticket.build({
    title, 
    price,
    userId: req.currentUser!.id
  });

  try {
    await ticket.save();
    console.log(`Created ticket successfully (${title}-$${price})`);
    res.status(201).send(ticket);

  } catch (error) {
    console.log(`Failed to save ticket!`);
    throw new BadRequestError('Failed to save ticket');
  }
});


export { router as createTicketRouter };
