const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
connectDB();
app.use(express.json({ extended: false }));


app.use(express.json());

app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('*', (req, res) => {
  res.status(200).json({
    message: 'bad request',
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('hello world'));
