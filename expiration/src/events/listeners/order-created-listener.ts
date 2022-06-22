import { Listener, OrderCreatedEvent, Subjects } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;


  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();  // calculate expiration time left 
    await expirationQueue.add({ orderId: data.id }, {  // config obj
      delay // in ms
    });
    msg.ack();
  }
}
