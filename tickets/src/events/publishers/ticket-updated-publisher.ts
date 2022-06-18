import { Publisher, Subjects, TicketUpdatedEvent } from '@lmrstickets/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
