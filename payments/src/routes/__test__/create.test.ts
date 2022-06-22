import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models';
import { OrderStatus, randomId } from '@lmrstickets/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');


it("returns a 404 if the purchasing order doesn't exists", async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({ 
      token: 'any',
      orderId: randomId() 
    })
    .expect(404);
});


it("returns a 401 when the order belongs to another user", async () => {
  const order = Order.build({
    id: randomId(),
    userId: 'owner',
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())  // different user
    .send({ 
      token: 'any',
      orderId: order.id 
    })
    .expect(401);
});


it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = randomId();
  const order = Order.build({
    id: randomId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))  // different user
    .send({ 
      token: 'any',
      orderId: order.id 
    })
    .expect(400);
});


it("returns a 201 with valid inputs", async () => {
  const userId = randomId();
  const order = Order.build({
    id: randomId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId)) 
    .send({ 
      token: 'tok_vida',
      orderId: order.id 
    })
    .expect(201);
  
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_vida');
  expect(chargeOptions.amount).toEqual(20*100);
  expect(chargeOptions.currency).toEqual('usd');
});