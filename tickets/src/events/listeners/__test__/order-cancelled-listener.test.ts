import { OrderCancelledListener, TicketUpdatedPublisher } from '../..';
import { natsSingleton } from '../../../nats-singleton';
import { Ticket } from '../../../models';
import { OrderCancelledEvent, OrderStatus, randomId } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';


const setup = async () => {
  // create listener
  const listener = new OrderCancelledListener(natsSingleton.client);
  
  // create/save ticket
  const orderId = randomId();
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf'
  });
  ticket.orderId = orderId;
  await ticket.save();

  // create fake event data
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id
    }
  };

  // create fake message 
  // @ts-ignore
  const msg: Message = { 
    ack: jest.fn()
  };

  return { listener, ticket, data, msg, orderId };
}


it('cancels a ticket reservation', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();  // available
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
});
