import mongoose from 'mongoose';
import { app } from './app';


const start = async () => {  // create auth db (specified after port)
  if (!process.env.JWT_KEY) {
    throw new Error("Environment variable JWT_KEY undefined!")
  }

  if (!process.env.MONGO_URI) {  // refactored to tickets-depl.yaml
    throw new Error("Environment variable MONGO_URI undefined!")
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
    console.log('Tickets service at port 3000...')
  });
}
start();
