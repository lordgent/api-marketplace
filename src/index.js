require('dotenv').config();

const express = require('express');
const port = process.env.PORT;
const app = express();
const route = require('./routes/index')

app.use(express.json());

app.use('/marketplace/api/v1/', route)
app.use("/uploads", express.static("uploads"));

app.listen(port,() => {
    console.log(`server running on port ${port}`)
});
