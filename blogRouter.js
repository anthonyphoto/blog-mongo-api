const express = require("express");
const router = express.Router();
//const bodyParser = require("body-parser");
//const jsonParser = bodyParser.json();
const { Blog } = require("./models");

//test

//router.use(express.json());  //don't need this as we have it server.js


router.get("/", (req, res)=> {
    Blog.find()
    .limit(20)
    .then(blogs => {
        res.json({
            blogs: blogs.map(blog => blog.serialize())
        });
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });

    });
});

router.get("/:id", (req, res)=>{
    Blog.findById(req.params.id)
    .then(blog => {
        res.json(blog.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/", (req, res)=>{
    const requiredFields = ["title", "author", "content"];
    requiredFields.forEach(key =>{
        if (!(key in req.body)){
            const message = `Missing field, ${key}`;
            return res.status(400).send(message);
        }
    });

    Blog.create({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    })
    .then(blog => res.status(201).json(blog.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error"});
    });
});

router.put("/:id", (req, res)=>{
    if (!req.params.id || ! req.body.id || req.params.id !== req.body.id) {
        console.error("ID Mismatch");
        return res.status(400).send({ message: "ID mismatch!" });
    }

    const updatable = ["title", "author", "content"];
    const toUpdate = {};

    updatable.forEach(key => {
        if (key in req.body) {
            toUpdate[key] = req.body[key];
        }
    });

    Blog.findByIdAndUpdate(req.params.id, { $set: toUpdate})
    .then(blog => res.status(204).end())
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error"});
    });
});


router.delete("/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id)
    .then(blog => res.status(204).end())
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error"});
    });        
});


/*
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
*/
module.exports = router;