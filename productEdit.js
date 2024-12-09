const express = require('express')
const Product = require('../models/product')
const router = new express.Router()

// Create new product
router.post('/',async (req, res) => {
    let msg = []
    if(req.body.name == ''){
       msg.push("Please fill the name.");
    }
    if(req.body.price < 0 || req.price == ''){
       msg.push("Please fill the price.");
    }
    if(req.body.discount < 0 || req.discount == ''){
       msg.push("Please fill the discount.");
    }
    if(req.body.details == ''){
        msg.push("Please fill the detail.");
    }

    if(msg.length > 0){
        res.status(400).json({
            message:msg.join('/')
        })
        return
    }
    // console.log("newproduct", newDbProduct)

    const newDbProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        newItem: req.body.newItem,
        length: req.body.length,
        fit: req.body.fit,
        style: req.body.style,
        sleeveStyle: req.body.sleeveStyle,
        color: req.body.color,
      });

      console.log('new',newDbProduct)

    let message = '';
    let data = null;
    let status = 200;
    try {
        const savedProduct = await newDbProduct.save();
        console.log('產品已保存:', savedProduct);
        res.json({data: savedProduct });
        // message = 'success';
        data = savedProduct;
    } catch (error) {
        console.error('保存產品失敗:', error);
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
    const updateProduct = '';
    let message = '';
    let data = null;
    let status = 200;
    try {
        updateProduct = await Product.findOneAndUpdate(
            {name},
            req.body,
        );
        console.log('updateProduct',updateProduct)
        
        if (!updatedProduct) {
         message = '產品未找到',
         status = 200,
         data = updatedProduct 
        }
             
        status(200).json({
            
        });
    } catch (e) {
        message = '產品保存失敗',
        status = 500,
        data = updatedProduct
         
    } finally{
        res.status(status).json({
            message:message,
            data
    })
}});

// Delete Product

router.delete('/:name', async (req, res) => {
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