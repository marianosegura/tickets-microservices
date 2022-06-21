import mongoose from 'mongoose';
import { app } from './app';
import { natsSingleton } from './nats-singleton';
import { TicketCreatedListener, TicketUpdatedListener } from './events';


const start = async () => {  // create auth db (specified after port)
  // environment variables verification
  const { JWT_KEY, MONGO_URI, NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } = process.env;
  const envVars = [
    { name: 'JWT_KEY', value: JWT_KEY }, 
    { name: 'MONGO_URI', value: MONGO_URI }, 
    { name: 'NATS_CLUSTER_ID', value: NATS_CLUSTER_ID }, 
    { name: 'NATS_CLIENT_ID', value: NATS_CLIENT_ID }, 
    { name: 'NATS_URL', value: NATS_URL }, 
  ];
  envVars.forEach(({ name, value }) => {
    if (!value) throw new Error(`Environment variable ${name} undefined!`);
  });
  
  // mongo connection
  try {
    await mongoose.connect(MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to mongodb')
  } catch (error) {
    console.log("Couldn't connect to mongodb!");
    console.log(error);
  }
  
  // nats connection
  try {
    await natsSingleton.connect(NATS_CLUSTER_ID!, NATS_CLIENT_ID!, NATS_URL!);
    console.log('Connected to NATS');

    const natsClient = natsSingleton.client;
    natsClient.on('close', () => {  // graceful disconnection
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsClient!.close());
    process.on('SIGNTERM', () => natsClient!.close());
  } catch (error) {
    console.log("Couldn't connect to NATS!");
    console.log(error);
  }

  // event listeners
  new TicketCreatedListener(natsSingleton.client).listen();
  new TicketUpdatedListener(natsSingleton.client).listen();

  app.listen(3000, () => {
    console.log('Orders service at port 3000...')
  });
}
start();
