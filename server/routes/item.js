const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const Media = require('../models/media');
const uuidv1 = require('uuid/v1');
const multer  = require('multer');
const fs = require('fs')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, uuidv1() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage })
const memcached = require('../config/memcached');

router.post('/additem', async function(req, res, next) {
    if(!req.user){
        return res.status(500).json({
            status: "error",
            error: "Need to login"
        });
    } 
    if(!req.body.content){
        return res.status(500).json({
            status: "error",
            error: "Empty content is not allowed"
        });
    }
    if(req.body.media) {
        for(const m of req.body.media) {
            const media = await Media.findOne({id: m}).select('used owner').lean();
            if(media.used || media.owner !== req.user.username) {
                return res.status(500).json({
                    status: "error",
                    error: "Media already used"
                });
            }
        }
    }
    const id = uuidv1();
    const currentUnixTime = parseInt((new Date().getTime() / 1000).toFixed(0));
    const newitem = new Item({
        id: id,
        username: req.user.username,
        content: req.body.content,
        childType: req.body.childType || null,
        parent: req.body.parent,
        interest: 0,
        retweeted: 0,
        property: { likes:0 },
        timestamp: currentUnixTime,
        media: req.body.media
    });
    await newitem.save();
    if(req.body.media) {
        for(const m of req.body.media) {
            await Media.updateOne({id: m}, { $set: {used: true} });
        }
    }
    if (req.body.childType === 'retweet') {
        await Item.updateOne({ id: req.body.parent }, { 
            $inc: { retweeted: 1, interest: 1 }
        });
        memcached.del('/item/' + req.body.parent, function (err) {});
    }
    memcached.del('/user/' + req.user.username + '/posts', function (err) {});
    return res.json({
        status: "OK",
        id : id
    });
});

router.get('/item/:id', async function(req, res, next) {
    let item = await Item.findOne({id:req.params.id}).select('-likedBy').lean();
    if(!item){
        return res.status(500).json({
            status: "error",
            error: "Item doesn't exist"
        });
    }
    return res.json({
        status: "OK",
        item: item
    });
});

router.delete('/item/:id', async function(req, res, next) {
    if(!req.user)
        return res.status(404).end();
    const item = await Item.findOne({id:req.params.id}).select('username media').lean();
    if(!item || item.username !== req.user.username)
        return res.status(404).end();
    const media = item.media;
    await Item.deleteOne({id:req.params.id}, async function (err, result) {
        if(err || result.deletedCount === 0){
            return res.status(404).end();
        }
        memcached.del('/user/' + req.user.username + '/posts', function (err) {});
        memcached.del('/item/' + req.params.id, function (err) {});
        res.status(200).end();
        media.forEach(filepath => {
            filepath = path.join(__dirname, '../uploads/' + filepath);
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error(err)
                }
            }); 
        });
    });
});

router.post('/item/:id/like', async function(req, res, next) {
    let like = req.body.like;
    if(like === undefined)
        like = true;
    if(like) {
        // const item = await Item.findOne({id: req.params.id}).select('likedBy').lean();
        // if(item && item.likedBy.includes(req.user.username)) {
        //     return res.status(500).json({
        //         status: 'error',
        //         error: 'liked'
        //     })
        // }
        await Item.updateOne({id: req.params.id},
            {
                $inc: { 'property.likes': 1, interest: 1  },
                $addToSet: { likedBy: req.user.username }
            }
        );
    }
    else {
        // const item = await Item.findOne({id: req.params.id}).select('likedBy').lean();
        // if(item && !item.likedBy.includes(req.user.username)) {
        //     return res.status(500).json({
        //         status: 'error',
        //         error: 'not liked'
        //     })
        // }
        await Item.updateOne({id: req.params.id},
            {
                $inc: { 'property.likes': -1, interest: -1 } ,
                $pull: { likedBy: req.user.username }
            }
        );
    }
    memcached.del('/item/' + req.params.id, function (err) {});
    return res.json({
        status: 'OK'
    });
});

router.get('/item/:id/like', async function(req, res, next) {
    if(!req.user) {
        return res.json({
            liked: false
        });
    }
    let item = await Item.findOne({ id: req.params.id });
    return res.json({
        liked: item.likedBy.includes(req.user.username)
    });
});

router.post('/addmedia', upload.single('content'), async function(req, res, next) {
    if(!req.user) {
        return res.status(500).json({
            status: "error",
            error: "Need to login"
        });
    }
    const newMedia = new Media({
        id: req.file.filename,
        owner: req.user.username,
        used: false
    });
    await newMedia.save();
    return res.json({
            status: "OK",
            id: req.file.filename
    });
});

router.get('/media/:id',  async function(req, res, next) {
    const filepath = path.join(__dirname, '../uploads/' + req.params.id);
    try {
        if(!fs.existsSync(filepath)) {
            return res.status(404).end();
        }
    } catch(err) {
        return res.status(404).end();
    }
    return res.status(200).sendFile(filepath);
});

module.exports = router;