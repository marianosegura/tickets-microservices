import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


let mongo: any;  // global, to disconnect afterAll

beforeAll(async () => {  // before all tests create/connect db and set env vars
  process.env.JWT_KEY = 'asdf'; // define jwt key for token logic
  
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});


beforeEach(async () => {  // before each test clear the db
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});


afterAll(async () => {  // after all tests, stop the db
  await mongo.stop();
  await mongoose.connection.close();
});


global.getCookie = async () => {  // helper function to get cookie
  const email = 'test@test.com';
  const password = 'password';

  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201); 
  
  const cookie = authResponse.get('Set-Cookie');
  return cookie;
};

declare global {  // declareglobal to avoid imports at each test file
  var getCookie: () => Promise<string[]>
}
