
const express = require("express");
const app = express();
const port = 8000;

app.set("view engine","ejs");

const path = require('path');

app.route("/first").get(function(req,res) {
    res.render("pages/first", {
        name: "My First"
    })
})

app.route("/second").get(function(req,res) {
    res.render("pages/first", {
        name: "My Second"
    })
})

app.get("/",function(req,res) {
    //res.send("Hello World!")
    res.render("pages/index")
})

app.listen(port);