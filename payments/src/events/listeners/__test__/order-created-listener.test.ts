import { natsSingleton } from '../../../nats-singleton';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, randomId, OrderStatus } from '@lmrstickets/common';
import { Order } from '../../../models';


const setup = async () => {
  const listener = new OrderCreatedListener(natsSingleton.client);

  const data: OrderCreatedEvent['data'] = {
    id: randomId(),
    version: 0,
    expiresAt: 'any',
    userId: 'any',
    status: OrderStatus.Created,
    ticket: {
      id: 'any',
      price: 10
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}


it('replicates an order', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
