import { OrderStatus } from "@lmrstickets/common";
import mongoose from "mongoose";
import { Order } from "./order";
// simplified version of the ticket model from tickets service
// the one from tickets service could have more fields and details


// model constructor properties
interface TicketAttrs {  // short for attributes
  title: string;
  price: number;
}

// document properties 
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// model properties
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}


const ticketSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, 
{  // schema options
  toJSON: {  
    transform(doc, ret) {  
      ret.id = ret._id;
      delete ret._id;
    }
  }
});


ticketSchema.statics.build = (attrs: TicketAttrs) => {  // attach builder for type checking
  return new Ticket(attrs);
}


ticketSchema.methods.isReserved = async function() {
  // check if ticket is reserved
  const existingOrder = await Order.findOne({ 
    ticket: this as any,  // ts complaining about 'this' type, is not inferred as TicketDoc
    status: {
      $in: [  // status indicating reserved ticket
        OrderStatus.Created, 
        OrderStatus.AwaitingPayment, 
        OrderStatus.Complete
      ]
    } 
  });
  return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { TicketDoc, Ticket };
