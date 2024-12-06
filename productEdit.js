const express = require('express')
const Product = require('../models/product')
const router = new express.Router()

// Create new product
router.post('/',async (req, res) => {
    const newProduct = req.body;
    let msg = []
    if(newProduct.name == ''){
       msg.push("Please fill the name.");
    }
    if(newProduct.price < 0 || newProduct.price == ''){
       msg.push("Please fill the price.");
    }
    if(newProduct.discount < 0 || newProduct.discount == ''){
       msg.push("Please fill the discount.");
    }
    if(newProduct.newItem === undefined || newProduct.newItem === null){
       msg.push("Please choose one.");
    }
    if(newProduct.details == ''){
        msg.push("Please fill the detail.");
    }

    if(msg.length > 0){
        res.status(400).json({
            message:msg.join('/')
        })
        return
    }
    // console.log("newproduct", newDbProduct)

    let message = '';
    let data = null;
    let status = 200;
    try {
        const savedProduct = await newDbProduct.save();
        // console.log('產品已保存:', savedProduct);
        // res.json({ message: 'success', data: savedProduct });
        // message = 'success';
        data = savedProduct;
    } catch (error) {
        // console.error('保存產品失敗:', error);
        res.json({ message: 'failed', data: 'Server issue' });
        message = 'failed';
        data = 'Server issue';
        status = 500;
    } finally {
        res.status(status).json({
            message: message,
            data
        });
    }

});

// PUT 請求：更新一個Product
router.put('/:name', async (req, res) => {
    const {name} = req.params;
    const updateProduct = req.body;
    const validFields = ['price', 'discount', 'newItem', 'details', 'fit', 'style', 'sleeveStyle', 'color'];
    const updateData = {};
    validFields.forEach(field => {
        if (updates[field] !== undefined) {
            updateData[field] = updates[field];  
        }
    });
    console.log('After update value!', req.body);

    try {
        updateProduct = await Product.findOneAndUpdate(
            {name},
            { $set: updateData },
            { new: true, runValidators: true } 
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: '產品未找到' });
        }
             
        return res.status(200).json({
            data: updatedProduct 
        });
    } catch (e) {
        console.error('保存產品失敗:', e.message);
        return res.status(500).json({
            message: '保存產品失敗',
            data: e.message  
        });
    }
});

// Delete Product

router.delete('/:name', async (req, res) => {
    // console.log('req',req.params)
    const {name} = req.params;
    try {
        await Product.deleteOne({
            name,
        });
        // console.log({name})
        res.status(200).json({
            message: '產品已刪除',
            
            // data: {}
        });
    } catch (e) {

        res.status(500).json({
            message: '刪除產品失敗',
            data: e.message
        });
    }
});


module.exports = router