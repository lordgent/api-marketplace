const express = require('express');
const app = express();
const route = require('./routes/index')
const cors = require('cors')

app.use(express.json());
app.use(cors())

app.use('/marketplace/api/v1/', route)
app.use("/uploads", express.static("uploads"));

const server = app.listen(5000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });