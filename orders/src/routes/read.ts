import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@lmrstickets/common';
import { Order } from '../models';


const router = express.Router();


router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) =>{
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

  res.send(order);
});


router.get('/api/orders', requireAuth, async (req: Request, res: Response) =>{
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');
  res.send(orders);
});


export { router as readOrdersRouter };
