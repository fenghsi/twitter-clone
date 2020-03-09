const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    owner: String,
    used: {
        type: Boolean,
        default: false
    }
});

let model = mongoose.model('Media', mediaSchema);
module.exports = model;