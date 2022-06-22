import { ExpirationCompleteListener } from '../../../events';
import { natsSingleton } from '../../../nats-singleton';
import { ExpirationCompleteEvent, randomId, OrderStatus } from '@lmrstickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket, Order } from '../../../models';


const setup = async () => {
  // create listener instance
  const listener = new ExpirationCompleteListener(natsSingleton.client);
  
  // create ticket
  const ticket = Ticket.build({
    id: randomId(),
    title: 'concert',
    price: 10
  });
  await ticket.save();

  // create order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order };
}


it('updates order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emits and order cancelled event', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  expect(natsSingleton.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsSingleton.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
