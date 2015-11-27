var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

app.use('/node_modules', express.static('node_modules'));
app.use('/js', express.static('js'));
app.use('/logo', express.static('logo'));

// configuration ===============================================================

//Mongoose code
mongoose.connect('mongodb://localhost:27017', {
    user: '',
    pass: ''
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to MongoDB');
});

require('./config/passport')(passport); 

app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser()); 

app.set('view engine', 'ejs');

app.use(session({ secret: 'csc3094lyfe' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());


require('./app/routes.js')(app, passport); 
app.listen(port, '0.0.0.0');
console.log('The magic happens on port ' + port);