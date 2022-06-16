import { BadRequestError } from '@lmrstickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models';


const router = express.Router();


router.get('/api/tickets', async (req: Request, res: Response) => {
  console.log(`\nGetting all tickets...`);
  
  try {
    const tickets = await Ticket.find({});
    console.log(`Returned all tickets successfully`);
    res.send(tickets);
  } catch (error) {
    console.log(`Failed to get tickets!`);
    throw new BadRequestError('Failed to get tickets!');
  }
});


export { router as getAllTicketsRouter };
