import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


// model constructor properties
interface TicketAttrs {  // short for attributes
  title: string;
  price: number;
  userId: string;
}

// document properties 
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;  // since we use version, and not the built-in __v, we have to declare it
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
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {  // nullable, if set the ticket is reserved by some order
    type: String
  }
}, 
{  // schema options
  toJSON: {  // change json representation
    transform(doc, ret) {  // ret is short for returned object
      ret.id = ret._id;
      delete ret._id;
    }
  }
});


// version config
ticketSchema.set('versionKey', 'version');  // use version instead of default __v field
ticketSchema.plugin(updateIfCurrentPlugin);


ticketSchema.statics.build = (attrs: TicketAttrs) => {  // attach builder for type checking
  return new Ticket(attrs);
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket };
