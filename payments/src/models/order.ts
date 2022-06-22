import mongoose from "mongoose";
import { OrderStatus } from '@lmrstickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


// model constructor properties
interface OrderAttrs {  
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

// document properties 
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

// model properties
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}


const orderSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  price: {
    type: Number,
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


// version config
orderSchema.set('versionKey', 'version');  // use version instead of default __v field
orderSchema.plugin(updateIfCurrentPlugin);


orderSchema.statics.build = (attrs: OrderAttrs) => {  // attach builder for type checking
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
    version: attrs.version,
  });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order };
