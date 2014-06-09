var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
	done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
      done(err, user);
	});
  });

  passport.use('local-login', new LocalStrategy(
    {
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      process.nextTick(
        function() {
		
          User.findOne({ 'local.username' :  username }, function(err, user) {

            if (err || !user)
            {
              return done(err);
		    }

            if (!user.validPassword(password))
            {
              return done(err);
            }

            return done(null, user);
          });
        }
      );
    }));
    
    passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {

      process.nextTick(function() {

        User.findOne({ 'local.username' :  username }, function(err, theUser) {

          if (err)
          {
            return done(err);
          }
          
          if (theUser != null)
          {
		    return done(err);
		  }

		  var user = new User();
		  user.local.username = username;
		  user.local.email = req.body.email;
		  user.local.password = user.generateHash(password);

		  user.save(function(err) {
			if (err)
		    {
			  throw err;
			}
			return done(null, user);
		  });
		  
		  return done(null, user);

        });    
      });

    }));

};
