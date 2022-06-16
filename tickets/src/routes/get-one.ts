import express, { Request, Response } from 'express';
import { NotFoundError } from '@lmrstickets/common';
import { Ticket } from '../models';


const router = express.Router();


router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`\nQuerying ticket (id ${id})...`);
  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    console.log(`Ticket doesn't exists (id ${id})!`);
    throw new NotFoundError();
  }
  
  console.log(`Ticket returned successfully (id ${id})`);
  res.send(ticket);
});


export { router as getTicketRouter };
