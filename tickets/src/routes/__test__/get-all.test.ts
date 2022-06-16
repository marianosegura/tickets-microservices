import request from 'supertest';
import { app } from '../../app';


function createTicket() {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.getCookie())
  .send({ 
    title: 'ticket', 
    price: 1
  })
  .expect(201);
}


it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  
  const res = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
  
  expect(res.body.length).toEqual(3);
});
