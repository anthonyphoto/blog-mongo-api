const express = require("express");
const router = express.Router();
const { Author } = require("./models");

router.get("/", (req, res)=> {
    Author.find()
    .limit(20)
    .then(authors => {
        res.json(authors);
})
    .catch(err =>{
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });

    });
});

router.get("/:id", (req, res)=>{
    Author.findById(req.params.id)
    .then(author => {
        res.json(author);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/", (req, res)=>{
    const requiredFields = ["firstName", "lastName", "userName"];
    requiredFields.forEach(key =>{
        if (!(key in req.body)){
            const message = `Missing field, ${key}`;
            return res.status(400).send(message);
        }
    });

    Author.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
//        created: new Date()

    })
    .then(author => res.status(201).json({
            _id: author._id,
            name: `${author.firstName} ${author.lastName}`.trim(),
            userName: author.userName
    }))
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

    const updatable = ["firstName", "lastName", "userName"];
    const toUpdate = {};

    updatable.forEach(key => {
        if (key in req.body) {
            toUpdate[key] = req.body[key];
        }
    });

    Author.findByIdAndUpdate(req.params.id, { $set: toUpdate})
    .then(author => res.status(204).end())
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error"});
    });
});


router.delete("/:id", (req, res)=>{
    Author.findByIdAndRemove(req.params.id)
    .then(author => res.status(204).end())
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error"});
    });        
});

module.exports = router;