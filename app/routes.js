var User = require('../app/models/user');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {

        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/signup', function(req, res) {
        
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/editProfile', isLoggedIn, function(req, res) {
        res.render('editProfile.ejs', {
            currentUser : req.user,
            message: req.flash('passwordMessage')
        });
    });
    
    app.get('/welcome', isLoggedIn, function(req, res) {
        if (req.user.permissions == "admin" || req.user.permissions == "super admin") {
            res.render('welcomeAdmin.ejs', {
                currentUser : req.user 
            });
        }else{
            res.render('welcome.ejs', {
                currentUser : req.user 
            });
        }
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.get('/welcome/getUsers', isLoggedIn,function(req, res) {
        User.find({}, function(err, users){
            
            if (err)
                return done(err);
            
            res.send(users);
        });
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/welcome', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/welcome',
        failureRedirect : '/login', 
        failureFlash : true
    }));
    
    app.post('/userProfile', isLoggedIn, function(req, res) {
        var userToSend;
        User.findOne({'email' : req.body.email}, function(err, users){
            if (err)
                return done(err);
            
            userToSend = users ;
            
            if (req.user.permissions == "admin" || req.user.permissions == "super admin") {
                res.render('editUser.ejs', {
                    currentUser : req.user, 
                    user : userToSend 
                });
            }
            else{
                res.render('profile.ejs', {
                    currentUser : req.user, 
                    user : userToSend 
                });
            }
        });

    });
    
    app.post('/edit', isLoggedIn, function(req, res) {
        var changed = {
            display_name : req.body.username,
            description : req.body.description            
        };
        User.update({'email' : req.body.email}, changed,function(err, users){
            if (err)
                return done(err);

            req.user = users;
            res.redirect("/editProfile");
        });

    });
    
    app.post('/adminEdit', isLoggedIn, function(req, res) {
        var changed = {
            display_name : req.body.username,
            description : req.body.description            
        };
        User.update({'email' : req.body.email}, changed,function(err, users){
            if (err)
                return done(err);
            
            req.user = users;
            res.redirect("/welcome");
        });

    });
    
    app.post('/editPassword', isLoggedIn, function(req, res) {
        
        User.findOne({'email' : req.body.email}, function(err, users){
            if (err)
                return done(err);
            
            if (req.body.newPassword != req.body.confirmNewPassword) {
                req.flash("passwordMessage", "New password doesn't match.");
                res.redirect("/editProfile");    
            }
            
            else if (!users.validPassword(req.body.oldPassword)) {
                req.flash("passwordMessage", "Old password is invalid.");
                res.redirect("/editProfile");    
            }else{
                
                var newPassword = users.generateHash(req.body.newPassword);
                
                var changed = {
                    password : newPassword
                };
                
                User.update({'email' : req.body.email}, changed,function(err, users){
                    if (err)
                        return done(err);
                    
                    req.user = users;
                    req.flash("passwordMessage", "");
                    res.redirect("/editProfile");
                });
            }
        });

    });
    
    app.post('/toggleAdmin', isLoggedIn, function(req, res) {
        var changed;
        console.log(req.body);
        if (req.body.permissions == "user") {
            changed = {
                permissions : "admin"
            };
        }else{
            changed = {
                permissions : "user"
            };
        }
        
        User.update({'email' : req.body.email}, changed,function(err, users){
            if (err)
                return done(err);

            res.redirect("/welcome");
        });

    });
    
    app.post('/delete', isLoggedIn, function(req, res) {

        User.remove({'email' : req.body.email},function(err){
            if (err)
                return done(err);

            res.redirect("/welcome");
        });

    });
    
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}