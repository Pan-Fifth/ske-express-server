//Gerneral Import
require('dotenv').config();
const cors = require('cors')
const express = require('express');
const errHandler = require('./middlewares/errMiddlewares/errHandler');
const pathNotFound = require('./middlewares/errMiddlewares/pathNotFound')
const morgan = require('morgan')

//route import
const authRoute = require('./routes/auth-route')
const userRoute = require('./routes/user-route')
const adminRoute = require('./routes/admin-route')
const orderRoute = require('./routes/order-route')
const buyerRoute = require('./routes/buyer-route');
const authenticate = require('./middlewares/authenticate');

//nescessary
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

//Main path
app.use("/auth",authRoute) //finish
app.use("/user",authenticate,userRoute) //finish
app.use("/admin",authenticate,adminRoute)
app.use("/order",authenticate,orderRoute)
app.use("/buyer",authenticate,buyerRoute)


//end path
app.use(errHandler)
app.use("*",pathNotFound)
const port = process.env.PORT
app.listen(port,()=>console.log('Server is running on port',port))