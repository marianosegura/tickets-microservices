import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


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


// we build a faked one to avoid dependency on auth service
global.getCookie = () => {  // helper function to get cookie
  // build jwt payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),  // random every time
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!);  // create jwt
  const sessionJSON = JSON.stringify({ jwt: token });  // create session
  const base64 = Buffer.from(sessionJSON).toString('base64');  // encode json as base64

  return [`express:sess=${base64}`];  // return cookie with the express format
};  // put it into an array to make supertest happy

declare global {  // declareglobal to avoid imports at each test file
  var getCookie: () => string[];
}
