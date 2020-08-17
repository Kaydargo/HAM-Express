const mongoose     = require('mongoose');
const validator    = require('validator'); 

const SchemaConfig = {
    timestamps : true, // Add timestamp
    versionKey : false // remove versioning
};

const artSchema = new mongoose.Schema({
    name : {
        type      : String,
        unique    : true,
        required  : true,
        validator : value => value.length > 0
    },
    year : {
        type       : Number,
        min        : 0,
        max        : new Date().getFullYear()
        // validator : value => value <= new Date().getFullYear()
    },
    description : {
        type       : String,
        required   : true
    },
    // image: { 
    //     data: Buffer, 
    //     contentType: String 
    // },
    classification : String,
    favorite : {
        type       : Number,
        default    : 0
    }
}, SchemaConfig);

module.exports = mongoose.model('Art', artSchema);