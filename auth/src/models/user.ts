import mongoose from "mongoose";
import { Password } from '../utils';


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


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {  // saving
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();  // we have to call done manually 
});


userSchema.statics.build = (attrs: userAttrs) => {  // attach builder for type checking
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };
