const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error("❌ DB_URI is not defined in environment variables!");
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = { DB_URI, connectDB };