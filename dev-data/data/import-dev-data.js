const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

async function main() {
  const db = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);
  await mongoose
    .connect(db)
    .then(() => console.log('DB connected succesfully.'))
    .catch((err) => console.log(err));
}

main();
//read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//importtours to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete tours from db

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('All tours deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
