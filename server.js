console.log('test');
const express = require("express");
const morgan = require("morgan");
const blogRouter = require("./blogRouter");

const app = express();



app.use(morgan("common"));
//app.use("/blog-posts", blogRouter);

app.use("/blog-posts", blogRouter);
/*app.get("/blog-posts", (req, res) => {
    res.send("test-res");
});
*/

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Listener ${process.env.PORT || 8080}`);
});