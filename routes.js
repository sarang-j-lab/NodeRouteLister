const express = require('express')

const create = async(req,res)=>{
    try {
        const city = await cityService.createCity(req.body)
        return  res.status(201).json({
            data: city,
            success: true,
            message: 'Successfully created a city',
            error: {}
        })
    } catch (error) {
        console.log('something went wrong on controller layer')
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a city',
            error: error
        })
    }    
}
const delete1 = async(req,res)=>{
    try {
        const city = await cityService.createCity(req.body)
        return  res.status(201).json({
            data: city,
            success: true,
            message: 'Successfully created a city',
            error: {}
        })
    } catch (error) {
        console.log('something went wrong on controller layer')
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a city',
            error: error
        })
    }    
}
const router = express.Router()

// city routes
router.post('/city',create) 
router.delete('/city/:id',delete1)
router.get('/city/:id',create)
router.get('/city',create)
router.patch('/city/:id',delete1)
router.post('/multiple',create)

// airport routes
router.post('/airport',create)
router.get('/airport/:id',delete1)


//flight routes
router.post('/flights', create )
router.get('/flight/:id',create)
router.get('/flights',create)
router.patch('/flights/:id',create)


module.exports = router 