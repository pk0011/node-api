const express =require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose');


//Fetching all products
router.get('/',(req, res, next) => {
    Product.find()
    .exec()
    .then(doc => {
        console.log(doc)
        res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})



//fetching by ID

router.get('/:productID',(req, res, next) => {
    const id = req.params.productID;
   Product.findById(id)
   .exec()
   .then(doc => {
       console.log("From DB", doc);
       if (doc){
        res.status(200).json(doc);
       }
       else{
           res.status(404).json({message: "This ID is not Valid"})
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({error: err})
})
});


//create a new entry with POST
router.post('/',(req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save().then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


//delete selected product
router.delete('/:productID',(req, res, next) => {
    const id = req.params.productID;  
    console.log(id)
    Product.deleteOne({ _id:id})
    .exec()
    .then(result => {

        console.log(result)
        if (result.deletedCount != 0){
        res.status(200).json({
            message: "Deleted requested entry",
            id: id
        })
        }
        else{
            res.status(404).json({
                message: "Id doesn't exist"
            })
        }
        })
    
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

//Update product details

router.patch('/:productID',(req, res, next) => {
    const id = req.params.productID;
    const updateOps = {}
    console.log(req.body)
    for (const key of Object.keys(req.body)) {
        console.log(key, "hello")
    updateOps[key] = req.body[key]
    }
    
    // Product.updateOne({_id: id},{ $set: {name: res.body.newName, price: res.body.newPrice}}) //Static approachwhere all should be updated(will not requier above loop)
    Product.updateOne({_id: id},{ $set: updateOps})  //Dynamic approach, only the one asked will be updates(will requier above loop)
    .exec()
    .then(result =>{
        console.log(result)
        if (result.matchedCount > 0)
        {res.status(200).json({
            message: "Update successful!!!",
            Output: result.acknowledged
        })}
        else{
            res.status(200).json({
                message: "Update unsuccessful!!!",
                Output: "ID doesn't exist",
                modified_data:[{
                    name: req.body.name,
                    price: req.body.price
                }]
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;