import { natsSingleton } from '../../../nats-singleton';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, randomId, OrderStatus } from '@lmrstickets/common';
import { Order } from '../../../models';


const setup = async () => {
  const listener = new OrderCancelledListener(natsSingleton.client);

  const order = Order.build({
    id: randomId(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'any',
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'any'
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order };
}


it('udpates the order status', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
