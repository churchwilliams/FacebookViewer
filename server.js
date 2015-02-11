var express = require('express');
var session = require('express-session');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.use(session({secret: 'something_secret'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new facebookStrategy({
	clientID: '343619705825283',
	clientSecret: 'beadd2730b455c28170bff98f054f952',
	callbackURL: 'http://localhost:8080/auth/facebook/callback'
}, function(token, rereshToken, profile, done){
	return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/failure'
}));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

var isAuthed = function(req, res, next){
	if(!req.isAuthenticated()){
		res.redirect('/failure');
	} else {
		next();
	}
};

app.get('/me', isAuthed, function(req, res){
	return res.json(req.user);
});

app.listen(8080, function(){
	console.log('Rocking out on port: 8080');
});