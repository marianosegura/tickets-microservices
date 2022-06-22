import mongoose from "mongoose";


// model constructor properties
interface PaymentAttrs {  
  orderId: string;
  stripeId: string;
}

// document properties 
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// model properties
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}


const paymentSchema = new mongoose.Schema(
{
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  }
}, 
{  // schema options
  toJSON: { 
    transform(doc, ret) {
      ret.id = ret._id;  // _id -> id
      delete ret._id;
    }
  }
});


paymentSchema.statics.build = (attrs: PaymentAttrs) => {  // attach builder for type checking
  return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);
export { Payment };
