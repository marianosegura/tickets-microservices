import { Listener, OrderCreatedEvent, Subjects } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../../events';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;


  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find ticket to reserve
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket as reserved (setting the orderId)
    ticket.set({ orderId: data.id });
    await ticket.save();

    // publish ticket updated event
    const { id, title, price, userId, orderId, version } = ticket;  // can't pass object due to optional fields between interfaces
    await new TicketUpdatedPublisher(this.client).publish({ 
      id, title, price, userId, orderId, version 
    });
    msg.ack();
  }
}
