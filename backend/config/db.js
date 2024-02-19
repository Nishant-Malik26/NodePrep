const mongoose = require('mongoose');
//const config = require('config');

//const db = config.get('mongoURL');

const connectDB = async () => {
  try {
    mongoose.connect(
      'mongodb+srv://nishantmalik2015:qYRh1Om8mNf8G7ih@cluster0.0uzogt3.mongodb.net/'
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
