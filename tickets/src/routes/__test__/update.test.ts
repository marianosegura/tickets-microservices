import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('returns a 404 if the provided id does\'nt exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();  // valid id
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: "test ticket",
      price: 20
    })
    .expect(404);
});


it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();  // valid id
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "test ticket",
      price: 20
    })
    .expect(401);
});


it('returns a 401 if the user is\'nt the ticket owner', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'ticket #1',
      price: 20
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.getCookie())  // new cookie, different user
    .send({
      title: 'ticket #1',
      price: 100
    })
    .expect(401);
});


it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getCookie();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket #1',
      price: 20
    });

  const id = res.body.id;  // ticket id
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ticket #1',
      price: -20
    })
    .expect(400);
});


it('updates the ticket given valid inputs', async () => {
  const cookie = global.getCookie();
  const res = await request(app)  // create
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket #1',
      price: 20
    });

  const newTitle = 'ticket #1 updated';
  const newPrice = 100;

  const ticketId = res.body.id;
  await request(app)  // update
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  const getRes = await request(app)  // verify
    .get(`/api/tickets/${ticketId}`)
    .send();

  expect(getRes.body.title).toEqual(newTitle);
  expect(getRes.body.price).toEqual(newPrice);
});
