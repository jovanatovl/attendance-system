import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ENV from '../config.js';

async function connect() {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(ENV.MONGODB_CONN_STRING);
  console.log('Connected to MongoDB');
  return db;
}

export default connect;
