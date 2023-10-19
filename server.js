const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);

app.listen(port, () => {
  console.log(`server is running on the ${port}...`);
});
