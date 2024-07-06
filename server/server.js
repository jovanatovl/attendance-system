import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import authRouter from './routes/auth.js';
import categoryRouter from './routes/category.js';
import deskRouter from './routes/desk.js';
import eventRouter from './routes/event.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8000;

app.get('/', (req, res) => {
  res.status(200).json('Home GET Request');
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/desks', deskRouter);
app.use('/api/events', eventRouter);

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    } catch (err) {
      console.error('Cannot connect to server: ' + err);
    }
  })
  .catch((err) => {
    console.error('Cannot connect to the database: ' + err);
  });
