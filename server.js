import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Reservation } from './models/reservationSchema.js';

dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());

// Set up CORS to allow requests from the frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

console.log('MongoURI from env:', mongoUri);
console.log('Port from env:', port);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})
.catch(err => {
  console.error('Connection to MongoDB failed:', err);
});

// Define the route to handle POST requests
app.post('/api/v1/reservation/send', async (req, res) => {
  try {
    const { firstName, lastName, date, time, email, phone } = req.body;

    const newReservation = new Reservation({
      firstName,
      lastName,
      date,
      time,
      email,
      phone
    });

    await newReservation.save();
    res.json({ message: 'Reservation saved successfully' });
  } catch (err) {
    console.error('Error saving reservation:', err);
    res.status(500).json({ error: 'Error saving reservation' });
  }
});

export default app;
