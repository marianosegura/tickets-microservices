import { Listener, OrderCancelledEvent, Subjects } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '..';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;


  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find ticket to reserve
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket as available
    ticket.set({ orderId: undefined });
    await ticket.save();

    // publish ticket updated event
    const { id, title, price, userId, version } = ticket;  // all but orderId
    await new TicketUpdatedPublisher(this.client).publish({ 
      id, title, price, userId, version 
    });
    msg.ack();
  }
}
