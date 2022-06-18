import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';
import { natsSingleton } from '../../nats-singleton';

it('has a route handler at /api/tickets for post requests', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .send({});
  expect(res.status).not.toEqual(404);
});


it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});


it('returns a status different than 401 is the user if signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({});
  expect(res.status).not.toEqual(401);
});


it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      price: 10
    })
    .expect(400);
});


it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'asdf',
      price: -10
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'asdf'
    })
    .expect(400);
});


it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});  
  expect(tickets.length).toEqual(0);  // db is cleared after every test

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'concert ticket',
      price: 20
    })
    .expect(201);
  
  tickets = await Ticket.find({});  
  expect(tickets.length).toEqual(1);  // check there's a new doc
});


it('publishes a create ticket event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'concert ticket',
      price: 20
    })
    .expect(201);
  
  expect(natsSingleton.client.publish).toHaveBeenCalled();
});
