import { natsSingleton } from './nats-singleton';
import { OrderCreatedListener } from './events';

const start = async () => { 
  const { NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL, REDIS_HOST } = process.env;
  const envVars = [ 
    { name: 'NATS_CLUSTER_ID', value: NATS_CLUSTER_ID }, 
    { name: 'NATS_CLIENT_ID', value: NATS_CLIENT_ID }, 
    { name: 'NATS_URL', value: NATS_URL }, 
    { name: 'REDIS_HOST', value: REDIS_HOST } 
  ];
  envVars.forEach(({ name, value }) => {
    if (!value) throw new Error(`Environment variable ${name} undefined!`);
  });
  
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

  // listeners
  new OrderCreatedListener(natsSingleton.client).listen();
}
start();
