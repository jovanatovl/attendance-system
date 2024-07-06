import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Provide unique username'],
    unique: [true, 'Username exists'],
  },
  password: {
    type: String,
    required: [true, 'Provide password'],
  },
  email: {
    type: String,
    required: [true, 'Provide unique email address'],
    unique: [true, 'Email exists'],
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: String },
  address: { type: String },
  profile: { type: String },
  role: {
    type: String,
    default: 'user',
  },
  desk: {
    type: mongoose.Types.ObjectId,
    ref: 'Desk',
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
