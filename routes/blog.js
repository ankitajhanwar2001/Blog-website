var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../modules/comments")
var Blog = require("../modules/blog");
var middlewareObj = require("../middleware");

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

router.get("/", function (req, res) {
    Blog.find({}, function(err, allBlg) {
        if(err) {
            console.log("ERROR!!");
        } else {
            res.render("blog/blogs", {blg : allBlg});
        }
    })
});

router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlg = {name: name, image: image, description: description, author: author};
    Blog.create(newBlg, function(err, allBlg) {
        if(err) {
            req.flash("error", "Something went wrong");
        } else {
            req.flash("success", "Blog uploaded successfully");
            res.redirect("/blogs");
        }
    });
});

router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    res.render("blog/new");
})

router.get("/:id", middlewareObj.isLoggedIn, function (req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("blog/show", {Blog : foundBlog});
        }
    });
});

//EDIT
router.get("/:id/edit", middlewareObj.checkBlogOwernership, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/blogs");
        } else {
            res.render("blog/edit", {blog: blog});
        }
    });
});

//UPDATE
router.put("/:id", middlewareObj.checkBlogOwernership, function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middlewareObj.checkBlogOwernership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/blogs");
        } else {
            req.flash("success", "Blog deleted successfully");
            res.redirect("/blogs");
        }
    });
});

module.exports = router;
