import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@lmrstickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket, Order } from '../models';


const router = express.Router();
const EXPIRATION_SECONDS = 60 * 15;


const validators = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId))
    .withMessage('Ticket id must be provided')
];


router.post('/api/orders', requireAuth, validators, validateRequest, async (req: Request, res: Response) =>{
  const { ticketId } = req.body;

  // find order's ticket
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // check if ticket is reserved
  const ticketIsReserved = await ticket.isReserved();
  if (ticketIsReserved) {
    throw new BadRequestError('Ticket is currently reserved');
  }

  // calculate expiration date
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

  // create/save order 
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  // publish created order event

  res.status(201).send(order);
});


export { router as createOrderRouter };