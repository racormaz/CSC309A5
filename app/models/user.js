var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String
    },
    display_name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    display_image: {
        data: Buffer,
        contentType: String
    },
    permissions: {
        type: String,
        trim: true
    },
    interests: [String],
    creationDate : Date,
    friends: [userSchema]
    
});

var postSchema = mongoose.Schema({
    postTo : {
        type: ObjectId
    },
    author : {
        type: ObjectId
    },
    content: {
        type:  String
    },
    date : {
        type: Date
    },
    comments : [commentSchema],
    tags: [String]

});

var commentSchema = mongoose.Schema({
    author : {
        type: ObjectId
    },
    content: {
        type:  String
    },
    date : {
        type: Date
    },
    parentPost: postSchema,
    tag: [String]

}); 

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);