import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();  // valid id
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
  });
  
  
it('returns the ticket when it exists', async () => {
  const title = 'concert ticket';
  const price = 20;

  const creationRes = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({ title, price })
    .expect(201);

  const ticketId = creationRes.body.id;
  const queryRes = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(200);
  expect(queryRes.body.title).toEqual(title);
});
