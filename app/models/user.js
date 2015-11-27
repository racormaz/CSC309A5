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
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);