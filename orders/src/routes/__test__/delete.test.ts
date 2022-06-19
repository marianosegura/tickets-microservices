import { OrderStatus } from '@lmrstickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';


it('updates the status of an order to cancelled', async () => {
  const user = global.getCookie();

  const ticket = Ticket.build({
    title: 'a ticket',
    price: 10
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);
  
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
});


it.todo('emits a order cancelled event');
