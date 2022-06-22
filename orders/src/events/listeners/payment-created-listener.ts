import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly queueGroupName: string = queueGroupName;


  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();  
    // could emit a order:updated event, but it will not be further updated, 
    // so we leave it as it is

    msg.ack();
  }
}
