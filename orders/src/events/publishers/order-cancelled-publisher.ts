import { Publisher, OrderCancelledEvent, Subjects } from '@lmrstickets/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
