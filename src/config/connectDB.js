const mongoose = require('mongoose');


const connectDB = async () => {
  // Check if the URI exists before attempting to connect
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the environment variables (.env file).');
    process.exit(1); 
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;