import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError, NotAuthorizedError } from '@lmrstickets/common';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Order, Payment } from '../models';
import { PaymentCreatedPublisher } from '../events';
import { natsSingleton } from '../nats-singleton';


const router = express.Router();

const validators = [
  body('token')
    .not()
    .isEmpty()
    .withMessage('Stripe token must be provided'),
  body('orderId')
    .not()
    .isEmpty()
    .withMessage('Order id must be provided')
];


router.post('/api/payments', requireAuth, validators, validateRequest, async (req: Request, res: Response) =>{
  const { token, orderId } = req.body;

  // find payment's order
  const order = await Order.findById(orderId);
  
  // validate order conditions
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Can't pay for a cancelled order");
  }

  // create stripe charge
  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,  // dollars -> cents (stripe works in the smallest unit)
    source: token  // token issued from the frontend
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  });
  await payment.save();

  await new PaymentCreatedPublisher(natsSingleton.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  });

  res.status(201).send(payment);
});


export { router as createPaymentRouter };
