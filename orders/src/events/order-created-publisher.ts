import { Publisher, OrderCreatedEvent, Subjects } from '@lmrstickets/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
