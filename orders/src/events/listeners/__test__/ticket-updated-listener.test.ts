import { TicketUpdatedListener } from '../..';
import { natsSingleton } from '../../../nats-singleton';
import { TicketUpdatedEvent, randomId } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';


const setup = async () => {
  // create listener instance
  const listener = new TicketUpdatedListener(natsSingleton.client);
  
  // create ticket
  const ticket = Ticket.build({
    id: randomId(),
    title: 'concert',
    price: 10
  });
  await ticket.save();

  // create fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'concert',
    price: 50,
    userId: randomId(),
    version: ticket.version + 1
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg };
}


it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});


it("doesn't acknowledges a future event when another is skipped", async () => {
  const { msg, data, listener } = await setup();
  data.version = 100;  // future version

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
