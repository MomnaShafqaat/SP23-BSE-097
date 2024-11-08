const express = require("express") ;
let server = express();

server.set("view engine", "ejs");

server.use(express.static("public"));

server.get("/about-me", (req, res) => {
  res.render("about-me");
});
server.get("/bootstrap", (req, res) => {
    res.render("index");
  });
server.get("/", (req, res) => {
  res.send(res.render("homepage"));
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});