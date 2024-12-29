const app = require('./app'); // Import the Express app from app.js
const connectDB = require('./config/connectDB'); // Import the DB connection function

const port = 3001;

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
