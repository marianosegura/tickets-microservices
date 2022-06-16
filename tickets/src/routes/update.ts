import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest, currentUser, BadRequestError } from '@lmrstickets/common';
import { Ticket } from '../models';


const router = express.Router();

const validators = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })  
    .withMessage('Price must be greater than 0')
];


router.put('/api/tickets/:id', requireAuth, currentUser, validators, validateRequest, async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`Updating ticket ${id}`);
  
  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    console.log(`Ticket ${id} doesn't exists!`);
    throw new NotFoundError();
  }
  
  if (ticket.userId !== req.currentUser!.id) {
    console.log(`Not owner tried to update ticket ${id}!`);
    throw new NotAuthorizedError();
  }

  const { title, price } = req.body;
  ticket.set({ title, price });  // update given fields

  try {
    await ticket.save();
    console.log(`Updated ticket ${id} successfully`);
    res.send(ticket);
    
  } catch (error) {
    console.log(`Failed to update ticket ${id}!`);
    throw new BadRequestError('Failed to update ticket');
  }
});


export { router as updateTicketRouter };
