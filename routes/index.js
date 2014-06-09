var User = require('../models/user');

module.exports = function(passport, app, router) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });

  app.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
  });

  app.post('/dologin',
    passport.authenticate('local-login', {
	  successRedirect : '/loginuser',
	  failureRedirect : '/login'
    })
  );

  app.get('/loginuser', isLoggedIn, function(req, res) {
	console.log('render userstart.jade');
    res.render('userstart', { user: req.user });
  });
  
  app.get('/register', function(req, res) {
    res.render('register', { title: 'Registrieren' });
  });
  
  app.post('/doregister', passport.authenticate('local-signup', {
	successRedirect : '/loginuser',
	failureRedirect : '/register'
  }));
  
  app.post('/updateemail', isLoggedIn, function(req, res) {

    User.findOne({ 'local.username' : req.user.local.username }, function (err, doc){
	  doc.local.email = req.body.email;
	  doc.save();
	  req.user.local.email = req.body.email;
	  res.render('userstart', { user: req.user });
	});
	
  });
  
  app.post('/deleteuser', isLoggedIn, function(req, res) {

    User.findOne({ 'local.username' : req.user.local.username }, function (err, doc){
	  doc.remove();
	  res.redirect('/login');
	});
	
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

};

function isLoggedIn(req, res, next) {

  console.log('isLoggedIn: ' + req.isAuthenticated()); 

  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}
