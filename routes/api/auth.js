var express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User")
const {check,validationResult} = require("express-validator")
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");


// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get("/",auth,async (req,res)=>{
    try{
        let user = await User.findById(req.user.id).select("-password");
        res.send(user);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({msg:"Server error"});
    }
    
});

// @route   POST api/auth
// @desc    Login
// @access  Public
router.post("/",[
    check('email','please enter valid email').isEmail(),
    check('password','please enter a password').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors:errors.array()});
    }
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            console.log("Incorrect Email")
            return res.status(400).send({msg:"Incorrect Email/Password"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            console.log("Incorrect Password")
            return res.status(400).send({msg:"Incorrect Email/Password"});
        }
        const payload = {
            user : {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn:3600000},
            (err,token)=>{
                if(err) throw err;
                res.send({token});
            }   
        )
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({msg:"Server error"});
    }
})

module.exports = router;