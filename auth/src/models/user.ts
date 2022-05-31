import mongoose from "mongoose";
import { PasswordManager } from '../utils';


// model constructor properties
interface userAttrs {  // short for attributes
  email: string;
  password: string;
}

// document properties 
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// model properties
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: userAttrs): UserDoc;
}


const userSchema = new mongoose.Schema(
{
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, 
{  // schema options
  toJSON: {  // change json representation
    transform(doc, ret) {  // ret is short for returned object
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});


userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {  // saving
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();  // we have to call done manually 
});


userSchema.statics.build = (attrs: userAttrs) => {  // attach builder for type checking
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };
