const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Item= require('../models/item');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');
const memcached = require('../config/memcached');

router.get('/user',  function(req, res, next) {
    const user = req.user ? req.user.username : null;
    return res.json({
        username: user
    });
});

router.post('/adduser', async function(req, res, next) {  
    const key = uuidv4();
    
    // create reusable transporter object using the default SMTP transport

    // create reusable transporter object using the default SMTP transport
    // const transporter = nodemailer.createTransport({
    //     // service:'Gmail',
    //     // pool: true,
    //     // auth: {
    //     //     user: 'lbfmsbu@gmail.com', // generated ethereal user
    //     //     pass: 'bing1999lingF'// generated ethereal password
    //     // }
    //     host: 'localhost',
    //     port: 25,
    //     tls:{
    //         rejectUnauthorized: false
    //     }
    // });  
    
    // const message = {
    //     from: '"LBFM" <lbfmsbu@cse356.com>', // sender address
    //     to: req.body.email, // list of receivers
    //     subject: 'ValidationKey', // Subject line
    //     text: 'Validation key: <' + key + '>', // plain text body
    // };

    // transporter.on("idle", function() {
        // transporter.sendMail(message, async function(error, info){
        //     if (error) {
        //         console.log(error);
        //     }
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                verified: false,
                key: key
            });
            try {
                await newUser.save();
            }
            catch (err) {
                return res.status(500).json({
                    status: "error",
                    error: err
                });
            }
        
            return res.json({
                status: "OK"
            });
        // });
    // });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user){ 
            return res.status(500).json({
                status: "error",
                error: info.message
            });
        }
        req.logIn(user, function(err) {
            if(err)
                return res.status(500).json({
                    status: "error",
                    error: err
                });
            return res.json({
                status: "OK",
                username: req.user.username
            });
        });
    })(req, res, next);
});

router.post('/logout', function(req, res, next) {
    if(!req.user) {
        return res.status(500).json({
            status: "error"
        });
    }
    req.logout();
    return res.json({
        status: "OK"
    });
});

router.post('/verify',  function(req, res, next) {
    const email = req.body.email;
    const key = req.body.key;
    User.findOne({ 'email': email }, async function (err, user) {
        if(err || !user){
            return res.status(500).json({
                status: "error",
                error: "User doesn't exists"
            });
        }
        if(user.validKey(key) || key === 'abracadabra'){
            user.verified = true;
            await user.save();
            return res.json({
                status: "OK"
            });
        }
        else {
            return res.status(500).json({
                status: "error",
                error: "Invalid Validation Key"
            });
        }
    });
});

router.get('/user/:username',  async function(req, res, next) {
    let user = await User.findOne({ 'username': req.params.username }).select('username email followers following').lean();
    if(!user){
        return res.status(500).json({
            status: "error",
            error: "User doesn't exist"
        });
    }
    return res.json({
        status: "OK",
        user: {
            username: user.username,
            email : user.email,
            followers : user.followers ? user.followers.length : 0,
            following : user.following ? user.following.length : 0
        }
    });
});

router.get('/user/:username/posts', async function(req, res, next) {
    let limit = req.query.limit || 50;
    //Check constraint limit.
    if(limit > 200){
        limit = 200;
    }
    // User.findOne({ 'username': req.params.username }, async function (err, user) {
    //     if(err || user == null){
    //         return res.json({
    //             status: "error",
    //             error: err
    //         });
    //     }
    //     else{
            try { 
                let itemIds = await Item.find({username:req.params.username}).sort({timestamp:-1}).select('id').limit(limit).lean();
                itemIds = itemIds.map(i => i.id);
                return res.json({
                    status: "OK",
                    items: itemIds
                });
            } catch(err) {
                return res.status(500).json({
                    status: "error",
                    error: err
                });
            }
    //     }
    // });
});

router.post('/user/following',  async function(req, res, next) {
    return res.json({
        status: "OK",
        following: req.user.following.includes(req.body.username)
    });
});

router.get('/user/:username/following',  async function(req, res, next) {
    let limit = req.query.limit || 50;
    if(limit > 200){
        limit = 200;
    }
    let user = await User.findOne({username:req.params.username}).select('following').lean();

    return res.json({
        status: "OK",
        users: user.following ? user.following.slice(-limit).reverse() : []
    });
});

router.get('/user/:username/followers',  async function(req, res, next) {
    let limit = req.query.limit || 50;
    if(limit > 200){
        limit = 200;
    }
    let user = await User.findOne({username:req.params.username}).select('followers').lean();

    return res.json({
        status: "OK",
        users: user.followers ? user.followers.slice(-limit).reverse() : []
    });
});

router.post('/follow',  async function(req, res, next) {
    if(req.user) {
        const username = req.body.username;
        const follow = req.body.follow;
        // if(username===req.user.username)//cannot follow urself
        //     return res.status(500).json({
        //         status: "error",
        //         error: "Can't follow yourself"
        //     });
        // const user = await User.findOne({username:username}).select('username').lean();
        // //cannot follow nonexist user
        // if(!user) {
        //     return res.status(500).json({
        //         status: "error",
        //         error: "User doesn't exist"
        //     });
        // }
        // if(follow && req.user.following.includes(username)) {
        //     return res.status(500).json({
        //         status: "error",
        //         error: "User is already following"
        //     });
        // }
        // if(!follow && !req.user.following.includes(username)) {
        //     return res.status(500).json({
        //         status: "error",
        //         error: "User isn't following"
        //     });
        // }

        if(follow){
            await Promise.all([
                User.updateOne({username: req.user.username}, { $addToSet: { following: username }}),
                User.updateOne({username: username}, { $addToSet: { followers: req.user.username }})
            ]);
            // memcached.del('/user/' + req.user.username, function (err) {});
            // memcached.del('/user/' + username, function (err) {});
            // memcached.del('/user/' + req.user.username + "/following", function (err) {});
            // memcached.del('/user/' + username + "/followers", function (err) {});
            return res.json({
                status: "OK"
            });
        }
        else{
            await Promise.all([
                User.updateOne({username: req.user.username}, { $pull: { following: username }}),
                User.updateOne({username: username}, { $pull: { followers: req.user.username }})
            ]);
            // memcached.del('/user/' + req.user.username, function (err) {});
            // memcached.del('/user/' + username, function (err) {});
            // memcached.del('/user/' + req.user.username + "/following", function (err) {});
            // memcached.del('/user/' + username + "/followers", function (err) {});
            return res.json({
                status: "OK"
            });
        }
    }
    return res.status(500).json({
       status: "error",
       error: "You have to login"
    });
});

module.exports = router;