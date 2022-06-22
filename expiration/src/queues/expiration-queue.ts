import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events';
import { natsSingleton } from '../nats-singleton';


interface Payload {
  orderId: string;
}


const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});


expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsSingleton.client).publish({
    orderId: job.data.orderId
  })
});


export { expirationQueue };
