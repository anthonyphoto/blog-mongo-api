const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { BlogPosts } = require("./models");

BlogPosts.create("Photography", "This blog is to show how to take photos", "Anthony Kim");

router.get("/", (req, res)=> {
    res.json(BlogPosts.get());
});

router.post("/", jsonParser, (req, res) => {
    requiredField = ['title', 'content', 'author'];
    for (let i = 0; i < requiredField.length; i++) {
        if (!(requiredField[i] in req.body)) {
            res.status(400).send("missing field: " + requiredField[i]);
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(post);
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    BlogPosts.delete(id);
    console.log(id);
    res.status(204).end();
});

router.put("/:id", jsonParser, (req, res)=> {
    const id = req.params.id;
    console.log(id);
    const post = BlogPosts.posts.find(obj => obj.id === id);
    BlogPosts.update(req.body);
    res.status(203).end();
});

module.exports = router;