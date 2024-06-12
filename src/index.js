require('dotenv').config()
const express = require('express');
const app = express();
const route = require('./routes/index')
const cors = require('cors')

const PORT = process.env.PORT || 5000; 

app.use(express.json());
app.use(cors())

app.use('/marketplace/api/v1/', route)
app.use("/uploads", express.static("uploads"));

app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`)
});
