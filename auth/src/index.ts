import express from 'express';
import 'express-async-errors';  // to throw custom errors in async functions
import { json } from 'body-parser';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError  } from './errors';

const app = express();
app.use(json());

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.get('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);  // custom error handler

app.listen(3000, () => {
  console.log('Auth service at port 3000...')
});
