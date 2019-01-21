const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require("../server.js");

const expect = chai.expect;

chai.use(chaiHttp);

describe ("Blog API Testing", function () {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it("retreive blog on GET", function(){
        return chai.request(app)
            .get("/blog-posts")
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);
                res.body.forEach(function(obj) {
                    expect(obj).to.be.a("object");
                    expect(obj).to.include.keys(["title", "content", "author"]);
                });
            })

    });

    it("create an article on POST", function() {
        const newPost = {
            title: "Programming",
            content: "How to code",
            author: "Diane Kim",
        };

        return chai.request(app)
            .post("/blog-posts")
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.deep.equal(Object.assign(newPost, { id: res.body.id, publishDate: res.body.publishDate }));
                expect(res.body).to.include.keys(["title", "content", "author", "id"]);
                expect(res.body.id).to.not.equal(null);
            });
    });

    it("Update on POST", function() {
        const updatedPost = {
            title: "Revised",
            content: "updated",
            author: "Anthony"
        };

        return chai.request(app)
            .get("/blog-posts")
            .then(function(res) {
                updatedPost.id = res.body[0].id;
                
                return chai.request(app)
                    .put("/blog-posts/" + updatedPost.id)
                    .send(updatedPost);
            })
            .then(function(res){
                expect(res).to.have.status(203);
            });
    });

    it("Delete on DELETE", function() {
        return chai.request(app)
                .get("/blog-posts")
                .then(function(res){
                    return chai.request(app) 
                    .delete("/blog-posts/" + res.body[0].id)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                })
    });
});