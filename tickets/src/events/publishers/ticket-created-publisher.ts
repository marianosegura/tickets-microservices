import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from '@lmrstickets/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
