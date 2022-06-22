import { Subjects, Publisher, PaymentCreatedEvent } from '@lmrstickets/common';


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
   readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
