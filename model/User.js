const mongoose      = require('mongoose');
const localMongoose = require('passport-local-mongoose'); 

const SchemaConfig = {
    timestamps : true, // Add timestamp
    versionKey : false // remove versioning
};

const userSchema = new mongoose.Schema({
    // role : String,
},SchemaConfig);

userSchema.plugin(localMongoose)


module.exports = mongoose.model('User', userSchema);