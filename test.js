const mongoose = require("mongoose")
const express = require('express')
const dotenv = require("dotenv")
const app = express()
dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(express.json());
app.use(require('./router/auth'));

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.send('Hello world form the server')
})

app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`)
})
