const http=require('http'); 
const express=require('express'); 
const app = express(); 
const debug = require("debug")("node-angular"); 
const bodyparser=require('body-parser'); 
const cors=require('cors');
var api = require('./routes/apiRoutes')

const PORT = 3000 || process.env.PORT

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors());
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/', function (req, res, next) {
    res.send({ message: 'Welcome to SBU APIs' })
})

//All api routes to apiRoutes file
app.use('/api',api)


//Handling all unmatched routes
app.use(function(req, res, next) {
    res.status(404).json({status:404,message:"Route not found"});
    next();
});

//Listening to PORT
app.listen(PORT,()=>console.log("Server process is running on Port 3000"));
