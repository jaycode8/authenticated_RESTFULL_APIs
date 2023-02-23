const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.URL,{useNewUrlParser : true}, (err) =>{
    if(err){
        console.error(err.message);
    }else{
        console.info('Successfully connected to the mongo database');
    };
});