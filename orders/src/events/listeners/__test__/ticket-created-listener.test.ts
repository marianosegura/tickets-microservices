import { TicketCreatedListener } from '../../../events';
import { natsSingleton } from '../../../nats-singleton';
import { TicketCreatedEvent, randomId } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';


const setup = async () => {
  // create listener instance
  const listener = new TicketCreatedListener(natsSingleton.client);
  
  // create fake data event
  const data: TicketCreatedEvent['data'] = {
    id: randomId(),
    title: 'concert',
    price: 10,
    userId: randomId(),
    version: 0
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}


it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
