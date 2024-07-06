import mongoose from 'mongoose';

const DeskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide the name'],
    unique: true,
  },
});

const Desk = mongoose.model('Desk', DeskSchema);
export default Desk;
