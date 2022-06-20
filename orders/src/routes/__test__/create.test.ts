import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, Ticket } from '../../models';
import { OrderStatus } from '@lmrstickets/common';
import { natsSingleton } from '../../nats-singleton';


it("returns an error if the ticket doesn't exists", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId })
    .expect(404);
});


it("returns an error if the ticket is reserved", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});


it("reserves an available ticket", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});


it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsSingleton.client.publish).toHaveBeenCalled();
});