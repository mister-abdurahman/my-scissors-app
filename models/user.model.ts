import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10

export interface UserDetails {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  urlId: ArrayConstructor | undefined[]
}

export type RetrievedUserDetail = UserDetails & UserModel

export interface UserModel extends Model<UserDetails> {
  login(email: string, password: string) : UserDetails
  comparePassword(password: string) : UserDetails
}

const userSchema = new Schema<UserDetails, UserModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: [true, "Enter your Email"], unique: true },
    password: {
      type: String,
      minLength: 4,
      required: [
        true,
        "Your password should contain lower and upper letter case, a number, a character and be at least 5 length long",
      ],
    },
    urlId: { type: Array, default: [] },
  },
  { timestamps: true }
)

// function is fired before doc is saved to db
userSchema.pre('save', async function(next){
  try {
    if (!this.isModified('password')) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next();
  } catch (error:any) {
    return next(error)
  }

}) 

// userSchema.methods.comparePassword = async function (password: string) {
//   try {
//     const match = await bcrypt.compare(password, this.password);
//     if(!match) throw Error('Incorrect Password')
//     return match;
//   } catch (error) {
//     throw new Error('Error comparing passwords');
//   }
// };

// static method to login user
userSchema.statics.login = async function(email:string, password: string){
  const user = await this.findOne({email})
  if(user){
   const auth = await bcrypt.compare(password, user.password)
   if(auth) return user
  
   throw Error('Incorrect Password')
  }
  throw Error("Incorrect Email")
}

export default model<UserDetails, UserModel>('user', userSchema);