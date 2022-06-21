import { OrderCreatedListener, TicketUpdatedPublisher } from '../../../events';
import { natsSingleton } from '../../../nats-singleton';
import { Ticket } from '../../../models';
import { OrderCreatedEvent, OrderStatus, randomId } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';


const setup = async () => {
  // create listener
  const listener = new OrderCreatedListener(natsSingleton.client);
  
  // create/save ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf'
  });
  await ticket.save();

  // create fake event data
  const data: OrderCreatedEvent['data'] = {
    id: randomId(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    ticket: {
        id: ticket.id,
        price: ticket.price,
    }
  };

  // create fake message 
  // @ts-ignore
  const msg: Message = { 
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
}


it('reserves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);  // orderId set = reserved
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});


it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsSingleton.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsSingleton.client.publish as jest.Mock).mock.calls[0][1]);
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
