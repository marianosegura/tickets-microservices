import mongoose from 'mongoose';
import { app } from './app';


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
