const express = require('express');
const product = require('../models/product')

const router = new express.Router()

//getOneProduct(req,res)
router.get('/:name', async (req, res) => {
    
    try {
        const product = await getOneProduct(req.params.name);
        res.json(product);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

//getAllProducts(req,res)
router.get('/', async (req, res) => {
    try {
        const productItems = await getProducts();
        res.json(productItems);
        //console.log(product);
    } catch (error) {
        console.error('routerServer error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

//-------------------------------------------------------------------

const getProducts = async () => {
    const products = await product.find({
        'sku.Unit.qty': { $gt: 0 }
    });
 
    return products;
};


const getOneProduct = async (name) => {
    const productItem = await product.find(
        {name}
    );
    // console.log(productItem);
    return productItem;
};

const getCategoryItems = (categories) => {
    console.log('categories',categories)
    return items.filter(item => item.category === categories);
};

// Route to get items by category
router.get('/:categories', async (req, res) => {
    console.log('req',req)
    try {
        const products = await getCategoryItems(req.params.category);
        console.log('products', products);
        res.json(products);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});



module.exports = router
