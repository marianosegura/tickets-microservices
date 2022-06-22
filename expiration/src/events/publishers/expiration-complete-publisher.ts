import { Publisher, ExpirationCompleteEvent, Subjects } from '@lmrstickets/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
