var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
var fs = require('fs');

module.exports = function(passport) {
    
    var empty = true;
    
    User.find({}, function(err, users){
            if (err)
                return done(err);
            
            if (users.length == 0) {
                empty = true;
            }
            else{
                empty = false;
            }
        });


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {

        process.nextTick(function() {
    

        User.findOne({ 'email' :  email }, function(err, user) {

            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                
                var newUser = new User();
                
                if (empty) {
                    newUser.permissions = "super admin";
                    empty = false;
                }
                else{
                    newUser.permissions = "user";
                }

                newUser.email = email;
                newUser.password = newUser.generateHash(password);;
                newUser.description = req.body.description;
                if (req.body.username == "") {
                  newUser.display_name = email;
                }
                else{
                  newUser.display_name = req.body.username;                 
                }

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 

        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found or password is incorrect.')); 
            }

            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'No user found or password is incorrect.')); 
            }

            return done(null, user);
        });

    }));

};