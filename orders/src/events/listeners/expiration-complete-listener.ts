import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderStatus, ExpirationCompleteEvent } from '@lmrstickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';
import { OrderCancelledPublisher } from '../';
import { natsSingleton } from '../../nats-singleton';


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;
  
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ 
      status: OrderStatus.Cancelled
    });
    await order.save(); 

    await new OrderCancelledPublisher(natsSingleton.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}
