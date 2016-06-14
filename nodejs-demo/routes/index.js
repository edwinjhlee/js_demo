var express = require('express');
var router = express.Router();
 
/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
  res.redirect('/home');
})
 
router.route('/login')
.get(function(req, res) {
    if (req.session.user){
        res.redirect("/home")
    }
    res.render('login', { title: '用户登录' });
})
.post(function(req, res) {
    var user={
        username: 'admin',
        password: '123456'
    }
    if(req.body.username === user.username && req.body.password === user.password){
        req.session.user = user;
        nexturl = "/home"
        res.redirect(nexturl);
    }else{
        req.session.error = "User Name of Login Password is inaccurate";
        res.redirect('/login');
    }
});
 
router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

function authentication(req, res) {
    if (!req.session.user) {
        req.session.err = "Please Login First."
        console.log("Output: Please Login First")
        return res.redirect('/login');
    }
}

router.get('/home', function(req, res) {
    authentication(req, res);
    res.render('home', { title: 'Home' });
});

module.exports = router;