import request from 'supertest';
import { app } from '../../app';


it("fails given an unexisting email", async () => {
  return request(app)
    .post('/api/users/signin')
    .send({  
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);  
});


it("fails given an incorrect password", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ 
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201); 
  await request(app)
    .post('/api/users/signin')
    .send({  
      email: 'test@test.com',
      password: 'asdgfadfsgas'
    })
    .expect(400);  
});


it("responds with a cookie given valid credentials", async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ 
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201); 
  const response = await request(app)
    .post('/api/users/signin')
    .send({  
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);  
  expect(response.get('Set-Cookie')).toBeDefined();
});



