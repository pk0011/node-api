const express =require('express');
const res = require('express/lib/response');
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order');
const Product = require('../models/product')

console.log(Product.findById("628e09490386c266bac46d1d").then(docs =>{
    console.log(docs)
}))




router.post('/',(req, res, next) => {
    // console.log("hello",req.body.productID)
    const id = String(req.body.productID);
    console.log("ID is:", id)
    // console.log("This is find",Product.findById(id))
    Product.findById(id)
    .then(product => {
        console.log("I am starting--------------------------------",product)
        if(!product) {
            res.status(404).json({
                    message: "Product not found"
            })
        }
        else{
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        })
        console.log("Order created: ",order)
        
        return order
        .save()
        .then( result => {
            res.status(201).json({
                message : "Order created",
                createdOrder: 
                {
                _id: result._id,
                product: result.productID,
                quantity: result.quantity
                },
                request: 
                {
                type: 'GET',
                url: "http://localhost:8001/orders/"+ result._id
                }
            })
        })
        
    }})
    .catch(err => {
        res.status(500).json({
            errors : err
        })
    })   
})


//GET ALL data
router.get('/',(req, res, next)=>{
    Order
    .find()
    .select("product quantity _id")
    .populate("product")
    .exec()
    
    // .then(docs =>{
    //     res.status(200).json(docs)
    // })
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc =>{
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: "http://localhost:8001/orders/"+ doc._id
                    }
                }
            }),
            
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


//get specific
router.get('/:OrderID',(req, res, next) => {
    const id = req.params.OrderID;
   Order.findById(id)
   .exec()
   .then(doc => {
       console.log("From DB", doc);
       if (doc){
        res.status(200).json({
            Orderdetails: doc,
            request : {
                type: 'GET',
                url : 'http://localhost:8001/orders'
            }
        });
       }
       else{
           res.status(404).json({message: "Order not found"})
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({error: err})
})
});


//delete selected product
router.delete('/:orderID',(req, res, next) => {
    const id = req.params.orderID;  
    console.log(id)
    Order.deleteOne({ _id:id})
    .exec()
    .then(result => {

        console.log(result)
        if (result.deletedCount != 0){
        res.status(200).json({
            message: "Deleted below Order",
            id: id,
            request: {
                typr: "POST",
                url : "http://localhost:8001/orders/",
                body:{
                    productID : "ID",
                    quantity : "Number"
                }
            }
        })
        }
        else{
            res.status(404).json({
                message: "Order already deleted"
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




router.patch('/:orderID',(req, res, next)=>{
    const oid = req.params.orderID;
    res.status(200).json({
        message: "updated order is: "+oid
    })
})

router.delete('/:orderID',(req, res, next)=>{
    const oid = req.params.orderID;
    res.status(200).json({
        message: "deleted order is: "+oid
    })
})

module.exports = router;