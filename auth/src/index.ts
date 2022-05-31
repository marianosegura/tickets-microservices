import express from 'express';
import 'express-async-errors';  // to throw custom errors in async functions
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError  } from './errors';


const app = express();
app.set('trust proxy', true);  // trust kubernetes ingress-nginx proxied traffic
app.use(json());
app.use(cookieSession({
  signed: false,  // don't ecnrypt our jwt
  secure: true,  // https exclusive
}));


// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.get('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);  // custom error handler

const start = async () => {  // create auth db (specified after port)
  if (!process.env.JWT_KEY) {
    throw new Error("Environment variable JWT_KEY undefined!")
  }
  
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to mongodb')
  } catch (error) {
    console.log("Auth service couldn't connect to mongodb!");
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Auth service at port 3000...')
  });
}
start();
