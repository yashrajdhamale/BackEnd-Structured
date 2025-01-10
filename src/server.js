const app = require('./app');
const connectDB = require('./config/connectDB'); 

const port = 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the cluster:', err);
  });
