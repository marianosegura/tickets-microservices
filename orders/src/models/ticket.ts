import { OrderStatus } from "@lmrstickets/common";
import mongoose from "mongoose";
import { Order } from "./order";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
// simplified version of the ticket model from tickets service
// the one from tickets service could have more fields and details


// model constructor properties
interface TicketAttrs {  // short for attributes
  id: string;
  title: string;
  price: number;
}

// document properties 
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// model properties
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>;
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


// version config
ticketSchema.set('versionKey', 'version');  // use version instead of default __v field
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1 // previous version
  }); 
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {  // attach builder for type checking
  const { id, title, price } = attrs;
  return new Ticket({
    _id: id,  // set constructor id as mongo _id
    title,
    price
  });
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
