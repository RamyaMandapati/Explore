const mongoose = require('mongoose');

// const url = "mongodb+srv://ramyamandapati:5PEfzBanJMGhROvh@cluster0.fogofum.mongodb.net/";
const url = 'mongodb://localhost:27017/dbtest';

async function main() {
  // Use connect method to connect to the server using mongoose
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = main;
