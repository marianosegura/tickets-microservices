import express from 'express';
import 'express-async-errors';  // to throw custom errors in async functions
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError  } from './errors';


const app = express();
app.set('trust proxy', true);  // trust kubernetes ingress-nginx proxied traffic
app.use(json());
app.use(cookieSession({
  signed: false,  // don't ecnrypt our jwt
  secure: process.env.NODE_ENV !== 'test',  // allow http for test, https for prod
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


export { app };
