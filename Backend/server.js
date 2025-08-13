require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json());
app.use(morgan('dev'));


connectDB()
  .then(() => console.log(' Database connected'))
  .catch((err) => {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaves', require('./routes/leaveRoutes'));


app.get('/', (req, res) => res.json({ message: 'Leave Management API running 🚀' }));


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(' Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
