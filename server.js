const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");

const blogRouter = require("./blogRouter");
const app = express();

app.use(express.json());  //this is needed if no jsonParser
app.use(morgan("common"));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });
  
  
app.use("/blog-posts", blogRouter);
app.use("*", (req, res) =>{
    res.status(404).json({ message: "Not Found" });
});



let server;

function runServer(databaseURL, port = PORT) {
//    const port = process.env.PORT || 8080;

        return new Promise((resolve, reject)=>{    
            mongoose.connect(
                databaseURL, 
                err => { 
                    if (err) { 
                        return reject(err);
                    }
                    server = app
                    .listen(port, ()=> {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on("error", err => {
                        mongoose.disconnect();
                        reject(err);
                    });
                }   
            )
        });

}

function closeServer() {
    return new Promise((resolve, reject)=> {
        console.log("Closing Server");
        server.close(err =>{
            if(err){
                reject(err);
                return;
            }
            resolve();
        })
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

/* app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Listener ${process.env.PORT || 8080}`);
}); */