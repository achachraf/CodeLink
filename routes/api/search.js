const express = require("express");
const router = express.Router();
const User = require("./../../models/User")
const Profile = require("./../../models/Profile")

router.post("/",async (req,res)=>{


    const query = req.body.query;
    // console.log(query);
    let usersQuery = `const fct = async () =>{const users = await User.find(${query}); return users};  fct()`
    try{
        const users = await eval(usersQuery);
        let profiles = [];
        for(user of users){
            let profile = await Profile.findOne({user:user._id}).populate('user',['name','avatar']);
            // profile = {...profile}
            if(profile !== null){
                profiles = [...profiles,profile];
            }
        }
        return res.send(profiles);
    }catch(err){
        //console.log(err)
        if(err.errmsg){
            return res.status(400).send({msg:err.errmsg})
        }
        return res.status(500).send({msg:"invalid syntaxe"})
    }
    // console.log(result);
})

module.exports = router;