const express = require('express')
// const {printHi,printHi, printHi\} = require('../../controllers/index')

// const {FlightMiddlewares} = require('../../middlewares/index')

function printHi(){
    console.log('hiiii!')
}
function sayHello(){
    console.log('hiiii!')
}
function sayHii(){
    console.log('hiiii!')
}


const router = express.Router()

// city routes
router.post('/city',sayHii) 
router.delete('/city/:id',sayHello)
router.get('/city/:id',printHi)
router.get('/city',sayHello)
router.patch('/city/:id',printHi)
router.post('/multiple',sayHello)

// airport routes
router.post('/airport',printHi)
router.get('/airport/:id',sayHello)


//flight routes
router.post('/flights',  printHi )
router.get('/flight/:id',sayHii)
router.get('/flights',sayHello)
router.patch('/flights/:id',printHi)



module.exports = router 