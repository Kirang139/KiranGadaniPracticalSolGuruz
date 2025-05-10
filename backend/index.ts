import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import SignalRoutes from './routes/SignalRoutes';
import cors from 'cors';

dotenv.config();

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', SignalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on:", PORT);    
})