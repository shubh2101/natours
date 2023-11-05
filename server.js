const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

async function main() {
  const db = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);
  await mongoose
    .connect(db)
    .then(() => console.log('DB connected succesfully.'));
  // .catch((err) => console.log(err));
}

main();

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`server is running on the ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
