import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Provide the title'],
  },
  description: {
    type: String,
    required: [true, 'Provide the description'],
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: String,
  },
  slot: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
  },
  desk: {
    type: mongoose.Types.ObjectId,
    ref: 'Desk',
  },
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
