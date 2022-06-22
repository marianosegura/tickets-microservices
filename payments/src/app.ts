import express from 'express';
import 'express-async-errors';  // to throw custom errors in async functions
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@lmrstickets/common';
import { createPaymentRouter } from './routes';


const app = express();
app.set('trust proxy', true);  // trust kubernetes ingress-nginx proxied traffic
app.use(json());
app.use(cookieSession({
  signed: false,  // don't encrypt our jwt
  secure: process.env.NODE_ENV !== 'test',  // allow http for test, https for prod
}));
app.use(currentUser);  // set current user


// routes
app.use(createPaymentRouter);


app.get('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);  // custom error handler


export { app };
