const mongoose  = require('mongoose');
const config = require('config');

const db = config.get('mongoURL')

const connectDB = async () => {
try {
    mongoose.connect(db);
} catch (error) {
    console.log(error)
}
}

module.exports = connectDB