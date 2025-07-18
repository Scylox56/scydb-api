const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/db');

const PORT = process.env.PORT || 3000;

mongoose.connect(config.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });