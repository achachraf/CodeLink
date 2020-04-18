const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path")

// app.get('/',(req,res)=>res.send('API Running'));

//init Middelware
app.use(express.json({extended:false}))
//Define routes
app.use('/api/users',require('./routes/api/users'))
app.use('/api/profiles',require('./routes/api/profiles'))
app.use('/api/posts',require('./routes/api/posts'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/search',require('./routes/api/search'))

//serve static assets in production
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


//connect MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started at ${PORT}`));