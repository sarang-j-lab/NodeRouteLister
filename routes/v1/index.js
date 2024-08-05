const express = require('express');

const app = express();

function sayHii(){
    console.log('hiiii!')
}


app.use('/V1',sayHii)
app.use('/V11111111',sayHii)

module.exports = app;