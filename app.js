var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"), // takes data from body(req.body.__)
    mongoose = require("mongoose"),
    passport = require("passport"),             // login/logout/register
    LocalStrategy = require("passport-local"),
    SeedDB = require("./seeds"),
    User = require("./modules/user"),
    Comment = require("./modules/comments"),
    methodOverride = require("method-override"), // lets us use PUT/DELETE
    flash = require("connect-flash"),
    Blog = require("./modules/blog");
const port = process.env.PORT || 8080;

app.use(require("express-session")({
    secret: "HELLOOOO....",
    resave: false,
    saveUninitialize: false
}));
//SeedDB();

var indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    commentRoutes = require("./routes/comments");

// mongoose.connect("mongodb://localhost/blog_v1");
mongoose.connect("mongodb+srv://ankitajhanwar:ankita@blog.1fy5pw4.mongodb.net/Blog-app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded("extended: true"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.listen(port, function() {
    console.log("Server has started!!");
});
