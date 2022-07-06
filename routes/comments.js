var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../modules/comments")
var Blog = require("../modules/blog");
var middlewareObj = require("../middleware");

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
       if(err) {
           console.log(err);
           res.redirect("/blogs");
       } else {
           res.render("comments/new", {blog : blog});
       }
    });
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    var comment = req.body.comment;
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/blogs");
        } else {
            Comment.create(comment, function (err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    // req.flash("success", "Comment added successfully");
                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middlewareObj.checkCommentOwernership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            res.redirect("back");
        } else {
            //console.log(campground.comments[0]);
            res.render("comments/edit", {blog_id: req.params.id, comment: comment});
        }
    });
});

//UPDATE
router.put("/:comment_id", middlewareObj.checkCommentOwernership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", middlewareObj.checkCommentOwernership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/blogs");
        } else {
            req.flash("success", "Comment deleted successfully");
            res. redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;
