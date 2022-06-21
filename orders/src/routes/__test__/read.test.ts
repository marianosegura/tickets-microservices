import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';
import { randomId } from '@lmrstickets/common';


const createTicket = async (i:number=1) => {
  const ticket = Ticket.build({
    id: randomId(),
    title: `ticket #${i}`,
    price: i
  });
  await ticket.save();
  return ticket;
}


it('fetches a user orders', async () => {
  const user1 = global.getCookie();
  const user2 = global.getCookie();

  // create 3 tickets
  const tickets = await Promise.all([1, 2, 3].map(async (i) => await createTicket(i)));

  // create an order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: tickets[2].id })
    .expect(201);
    
  // create 2 orders as user #2
  let ordersRes = [];
  for (let i = 0; i < 2; i++) {
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: tickets[i].id })
      .expect(201);
    ordersRes.push(orderRes);
  }

  // query user #2 orders
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // expect just user #2 orders
  expect(res.body.length).toEqual(2);

  for (let i = 0; i < ordersRes.length; i++) {
    expect(ordersRes[i].body.id).toEqual(res.body[i].id);  // orders equality
  }
});


it('fetches a given order', async () => {
  const user = global.getCookie();
  const ticket = await createTicket()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);
  
  expect(fetchedOrder.id).toEqual(order.id);
});


it('fails to fetch order from another user', async () => {
  const user1 = global.getCookie();
  const user2 = global.getCookie();
  const ticket = await createTicket()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .expect(401);
});