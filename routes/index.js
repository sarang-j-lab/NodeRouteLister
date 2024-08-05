const express = require('express');

const app = express();

function sayHii(){
    console.log('hiiii!')
}


app.use('/random',sayHii)

module.exports = app;