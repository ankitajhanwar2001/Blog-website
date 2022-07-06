var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../modules/user");

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

router.get("/", function (req, res) {
    res.redirect('/blogs');
    // res.render("home");
});

//REGISTER
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            if(newUser.username.length == 0) {
                req.flash("error", "Invalid username");
            } else if(req.body.password.length == 0) {
                req.flash("error", "Invalid password");
            } else {
                req.flash("error", "A user with the given username is already registered");
            }
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Registered successfully!!" + user.username);
            res.redirect("/blogs");
        });
    });
});

//LOGIN

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/blogs');
  });
});

module.exports = router;
