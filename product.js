const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 3001;
const host = 'localhost';

app.use(express.json());
app.use(express.static(__dirname+'/public'))
app.use(cors());

mongoose.connect('mongodb://localhost:27017/projectdb')
.then( () => {
    console.log("Database successfully connected!");
} )
.catch( (error) => {
    console.error("Database connected fails, please try again later.")
});

//set Schema

const productSchema = new mongoose.Schema({
    name: {type:String, require: true},
    price: {type: Number, require: true},
    discount: {type: Number, default:0},
    newItem: {type: Boolean, require:true},
    colorIcon:[{type:String}],
    sku: [{
            color: {type:String},
            image: [{type:String}],
            Unit: [{size: {type: Number}, qty:{type: Number}},]
    }],
    details:{type:String},
    length:{type:String},
    fit:{type:String},
    style : {type:String},
    sleeveStyle :{type:String},
    color :{type:String}

});

const product = mongoose.model('product', productSchema);

//Get one product
app.get('/products/:name', async (req, res) => {
    
    try {
        const product = await getOneProduct(req.params.name);
        res.json(product);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

//Get all products

app.get('/products', async (req, res) => {
    try {
        const productItems = await getProducts();
        res.json(productItems);
           console.log(product);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

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
    console.log(productItem);
    return productItem;
};

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});