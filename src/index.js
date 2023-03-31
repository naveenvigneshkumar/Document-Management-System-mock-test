// const express = require("express"), app = express();
// const {createServer} = require('./app');
// const app = createServer();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const app = require('./app');
const logger = require('./utils/logger');

//setup server to listen on port
app.listen(process.env.PORT || 8000, () => {
    logger.info(`Server is live on port ${process.env.PORT || 8000}`);
  })
