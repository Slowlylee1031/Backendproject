const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const userRouter = require('./routers/user')
const sessionRouter = require('./routers/session')
const productRouter = require('./routers/product')
const adminRouter = require('./routers/admin')
const initData = require('./models/init')

const app = express()

const port = process.env.PORT || 3000
app.use(express.json())

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./project_doc/openapi3_0.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// http://127.0.0.1:3000/api-docs

// session relies on db to store data, and session must be the first in 
// the chain of middlewares, so put everything in async function to run
// sequentially during server startup

async function startAPI() {
    //const mongoAddress = 'localhost:27017' // for WSL
    const mongoAddress = '127.0.0.1:27017' // for Windows

    try {
        console.log('Connecting to DB ......')
        await mongoose.connect(`mongodb://${mongoAddress}/fattishop`)
        console.log('Database connection successful')
        console.log('mongoose.connection.db: ' + mongoose.connection.db.databaseName)

        // add product data to DB if necessary
        await initData()
        // -----------------------------------

    } catch(err) {
        console.error('Database connection error: ' + err)
        process.exit(1)
    }

    // session configuration
    const store = new MongoDBStore({
        uri: `mongodb://${mongoAddress}/fattishop`,
        collection: 'sessions'
    })

    store.on('error', function(error) {
        console.log('session store error: ' + error);
    })

    app.use(session({
        secret: 'should be saved somewhere',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 1000*60*5 // session timeout of 5 minutes
        }
    }))

    // api routes
    app.use('/api/users', userRouter)
    app.use('/api/sessions', sessionRouter)
    app.use('/api/products', productRouter)    
    app.use('/api/admin', adminRouter)    

    // static content
    app.use(express.static(__dirname + '/public'))
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.htm')
    })
    // custom 404 page
    app.use((req, res) => {
        res.status(404)
        res.json({message: '404 - Not Found: ' + req.url})
    })
    // custom 500 page
    app.use((err, req, res, next) => {
        console.error(err.message)
        res.status(500)
        res.json({message: '500 - Server Error'})
    })

    app.listen(port, () => console.log(
        `Express started on http://0.0.0.0:${port}; ` +
        `press Ctrl-C to terminate.`)
    )
}

startAPI()
