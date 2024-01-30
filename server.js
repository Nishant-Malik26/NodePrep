const express = require('express');
const connectDB = require('./config/db')
const app = express();
connectDB();
app.use(express.json({extended : false}))
app.get('/',(req, res) => {
    console.log('hellllo from API')
})


app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('hello world') )