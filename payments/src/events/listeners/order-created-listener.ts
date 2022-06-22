import { Listener, OrderCreatedEvent, Subjects } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;


  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, status, userId, version, ticket: { price } } = data;
    const order = Order.build({ id, status, userId, version, price });
    await order.save();  // replicate data
    msg.ack();
  }
}
