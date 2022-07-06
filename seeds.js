var mongoose = require("mongoose"),
    Blog = require("./modules/blog");
    Comment = require("./modules/comments");

var data = [
    {
        name : "Priyanshu",
        image : "https://wallpaperaccess.com/full/5828.jpg",
        description : "This is the camp where Priyanshu visited."
    },
    {
        name : "Ankita",
        image : "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjJ8fGNhbXBncm91bmR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        description : "This is the camp where Ankita visited."
    },
    {
        name : "Kumkum",
        image : "https://a-static.besthdwallpaper.com/aurora-borealis-over-winter-campground-wallpaper-1920x1080-28535_48.jpg",
        description : "This is the camp where Kumkum visited."
    },
    {
        name : "Himanshu",
        image : "https://wallpaperaccess.com/full/5828.jpg",
        description : "This is the camp where Ankita visited."
    }
    // {name : "Sruti", image : "https://wallpaperaccess.com/full/5828.jpg"},
    // {name : "Mohit", image : "https://wallpaperaccess.com/full/5828.jpg"}
];

function SeedDB() {
    Blog.remove({}, function (err) {
        if(err) {
            console.log(err);
        } else {
            data.forEach(function (data) {
                Blog.create(data, function (err, blog) {
                   if(err) {
                       console.log(err);
                   } else {
                       console.log("created a seed");
                       Comment.create({
                        //    text: "It is a nice place.",
                        //    author: "mohit"
                       }, function(err, foundComment) {
                           if(err) {
                               console.log(err);
                           } else {
                               blog.comments.push(foundComment);
                               blog.save();
                           }
                       })
                   }
               });
            })
        }
    });
}

module.exports = SeedDB;
