const express = require('express');
const product = require('../models/product')

const router = new express.Router()

// const getCategoryItems = (category) => {
//     console.log('category',category)
//     console.log('return', product.find({ 'type': category }))
//     return product.find({ 'type': category });

// };

// Route to get items by category
router.get('/:category', async (req, res) => {
    
    try {
        const product = await getCategoryItems(req.params.category);
        res.json(product);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

const getCategoryItems = async (type) => {
    const productItem = await product.find(
        {type}
    );
    console.log('productItem',productItem);
    return productItem;
};




module.exports = router
