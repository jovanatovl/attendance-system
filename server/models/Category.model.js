import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide the name'],
    unique: true,
  },
  bgClass: {
    type: String,
    default: 'bg-indigo-500',
  },
  iconTag: {
    type: String,
    default: 'business',
  },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
