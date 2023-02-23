const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtKey = process.env.SecreteKey;
const mongoose = require('mongoose');
const {
    publisherSchema,
    booksSchema
} = require('../MODELS/publisher.models');
const publisherMOdel = mongoose.model('publisher', publisherSchema);
const booksModel = mongoose.model('books',booksSchema);
require('../MODELS/db');

const verifyToken = async (req,res,next) =>{
    try {
        const accessToken = await req.cookies['access-token'];
        if(!accessToken) {
            return res.status(400).json({error:"User not authenticated"});
        }else{
            const validateToken = await jwt.verify(accessToken, jwtKey);
            if(validateToken){
                req.authenticated = true;
                res.id = validateToken // this is the information response of the user sent to client
                return next()
            }
        }
    } catch (error) {
        res.json({message:error})
    }
}

router.post('/',(req,res)=>{
    const user= (req.body)
    res.json({message:user})
});

router.post('/addPublisher', async (req,res) =>{
    try {
        const publisher = new publisherMOdel(req.body);
        await publisher.save();
        res.status(201).json({success: true, data: publisher});
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    };
});

router.post('/login', async(req,res) =>{
    try {
        const publisher = req.body;
        const foundPablisher = await publisherMOdel.findOne({email : publisher.email, password: publisher.password});
        if(foundPablisher){
            let tokens = await jwt.sign({ user:foundPablisher._id}, jwtKey);
            res.cookie("access-token", tokens,{
                maxAge:60*60*24*10000,
                httpOnly: true
            })
            res.json({msg:"Successfully loged in"})
        }else{
            res.json({msg:"Login details mismatch"})
        }
    } catch (error) {
        res.json({msg:"User does not exist"});
    }
});

router.post('/addBooks', verifyToken, async (req,res) =>{
    try {
        const book = new booksModel({
            name: req.body.name,
            publishYear: req.body.publishYear,
            author: req.body.author,
            publisher: res.id.user
        });
        await book.save();
        const publisher = await publisherMOdel.findById({_id: book.publisher});
        publisher.publishedBooks.push(book);
        await publisher.save()
        res.status(200).json({book : book, status : res.status})
    } catch (error) {
        res.status(400).json({msg:error})
    }
});


router.get('/api/posts', verifyToken, async (req,res)=>{
    try {
        res.json({msg:"posts are here", publisher:res.id.user})
    } catch (error) {
        res.json(error);
    }
})


module.exports = router;