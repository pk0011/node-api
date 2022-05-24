const express =require('express');
const router = express.Router();

router.post('/',(req, res, next) => {
    const order = {
        product: req.body.product,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: "Handling POST Orders request",
        Order_details: order

    })
})

router.get('/:orderID',(req, res, next)=>{
    const oid = req.params.orderID;
    if (oid === 'hello'){
        res.status(200).json({
            message: oid + ", how are you?"
        })
    }
    else{
        res.status(200).json({
            message: "This is a normal Order: " + oid
        })
    }
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