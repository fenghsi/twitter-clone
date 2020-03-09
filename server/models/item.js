const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    username: String,
    content: String,
    parent: String,
    childType: String,
    interest: Number,
    retweeted: Number,
    property:{
        likes: Number,
    },
    likedBy: [String],
    timestamp: Number,
    media: [String]
});

let model = mongoose.model('Item', itemSchema);
model.collection.createIndex({content: "text"});
module.exports = model;