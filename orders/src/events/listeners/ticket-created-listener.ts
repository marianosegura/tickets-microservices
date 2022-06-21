import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@lmrstickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;
  
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price }); 
    await ticket.save();  // replicated data
    msg.ack();
  }
}
