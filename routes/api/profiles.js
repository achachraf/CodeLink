var express = require('express');
const router = express.Router();
const request = require("request");
const config = require("config");
const Profile = require("./../../models/Profile")
const User = require("./../../models/User")
const Post = require("./../../models/Post")
const auth = require("./../../middleware/auth")
const {check,validationResult} = require("express-validator")

// @route   GET api/Profiles/me
// @desc    Get User Profile
// @access  Private

router.get("/me",auth,
async (req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
        // console.log()
        if(!profile){
            return res.status(400).send({msg:"There is no profile for this user"})
        }
        res.send(profile)
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({msg:"Server error"})
    }
});

// @route   POST api/Profiles
// @desc    Add/Update Profile to a user
// @access  Private
router.post("/",[auth,[
    check("status","Status is required").not().isEmpty(),
    check("skills","Skills is required").not().isEmpty(),
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //destructing fields from body
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
    } = req.body
    //build profile object
    let profileFields = {}
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(status) profileFields.status = status;
    if(location) profileFields.location = location;
    if(githubusername) profileFields.githubusername = githubusername;
    if(bio) profileFields.bio = bio;
    if(skills){
        profileFields.skills = skills.split(",").map((item)=>item.trim());
    }
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    try{
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            )
            return res.send(profile)
        }
        profile = new Profile(profileFields);
        await profile.save();
        return res.send(profile) 
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("server error");
    }
})

// @route   GET api/Profiles/
// @desc    Get all profiles
// @access  Public

router.get("/",async (req,res)=>{
    try {
        let profiles = await Profile.find().populate("user",['name','avatar']);
        res.send(profiles)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }
})

// @route   GET api/Profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/:user_id",async (req,res)=>{
    try {
        let profile = await Profile.findOne({user:req.params.user_id}).populate("user",['name','avatar']);
        if(!profile){
           return res.status(400).send({msg:"No profile found for this user"});
        }
        res.send(profile)
    } catch (err) {
        console.log(err.message);
        if(err.kind == "ObjectId"){
            return res.status(400).send({msg:"No profile found for this user"});
        }
        res.status(500).send("server error");    
    }
})

// @route   GET api/Profiles/
// @desc    Delete Profile
// @access  Private

router.delete("/",auth,async (req,res)=>{
    console.log("deleting...")
    try {
        // delete posts
        await Post.deleteMany({user:req.user.id})

        //delete profile
        await Profile.findOneAndRemove({user:req.user.id});

        //delete user
        await User.findOneAndRemove({_id:req.user.id});
        res.send({msg:"Profile & user are deleted"})
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }
})

// @route   PUT api/Profiles/experience
// @desc    Update Profile experiences
// @access  Private


router.put("/experience",[auth,[
    check("title","title is required").not().isEmpty(),
    check("company","company is required").not().isEmpty(),
    check("from","from is required").not().isEmpty(),
]],async (req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.arrays()})
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp =  {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.send(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }

})

// @route   DELETE api/Profiles/experience/:exp_id
// @desc    Delete a Profile experiences
// @access  Private

router.delete("/experience/:exp_id",auth,async (req,res)=>{
    try {
        let profile = await Profile.findOne({user:req.user.id});
        profile.experience = profile.experience.filter((exp)=>{
            return exp.id != req.params.exp_id
        })
        await profile.save();
        res.send(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }
})


// @route   PUT api/Profiles/education
// @desc    Add education
// @access  Private


router.put("/education",[auth,[
    check("school","school is required").not().isEmpty(),
    check("degree","degree is required").not().isEmpty(),
    check("fieldofstudy","field of study is required").not().isEmpty(),
    check("from","start date is required").not().isEmpty(),
]],async (req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()})
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEduc =  {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        console.log(req.user.id);
        const profile = await Profile.findOne({user:req.user.id});
        console.log(profile);
        profile.education.unshift(newEduc);
        await profile.save();
        res.send(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }

})

// @route   DELETE api/Profiles/education/:edu_id
// @desc    Delete a Profile education
// @access  Private

router.delete("/education/:edu_id",auth,async (req,res)=>{
    try {
        let profile = await Profile.findOne({user:req.user.id});
        profile.education = profile.education.filter((educ)=>{
            return educ.id != req.params.edu_id
        })
        await profile.save();
        res.send(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");    
    }
})

// @route   GET api/Profiles/github/:uername
// @desc    Get user github repos 
// @access  Public
router.get("/github/:username",(req,res)=>{
    try {
        const options = {
            uri:`
            https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${
                config.get("githubClient")}&client_secret=${
                config.get("githubSecret")}`,
            method:"GET",
            headers : {'user-agent':'node.js'}
        }
        request(options,(errors,response,body)=>{
            if(errors){
                console.log(errors);
                exit(1);
            }
            if(response.statusCode !== 200){
                return res.status(404).send({msg:"github user not found"});
            }
            res.send(JSON.parse(body));
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");  
    }
})

module.exports = router;



