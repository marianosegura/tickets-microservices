import mongoose from "mongoose";


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


ticketSchema.statics.build = (attrs: TicketAttrs) => {  // attach builder for type checking
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket };
