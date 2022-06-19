import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@lmrstickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models';


const router = express.Router();


router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) =>{
  const { orderId } = req.params;
  const userId = req.currentUser!.id;

  const order = await Order.findById(orderId)
    .populate('ticket');

  if (!order) {
    console.log(`Order doesn't exists (id ${orderId})!`);
    throw new NotFoundError();
  }

  if (order.userId !== userId) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;  // technically a patch, not a delete
  await order.save();

  // publish a cancelled order event

  res.status(204).send(order);
});


export { router as deleteOrderRouter };
