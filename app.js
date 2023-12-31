// deno-lint-ignore-file no-unused-vars no-inner-declarations

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(function (err) {
  console.log(err);
});
async function main() {
  await mongoose.connect(process.env.MONGODB);
  console.log("Successfully connected to Database");
}

const composeSchema = new mongoose.Schema({
  name: String,
  content: String,
});

const Journal = mongoose.model("Journal", composeSchema);

app.get("/", function (req, res) {
  Journal.find().then(function (foundPost) {
    res.render("home", { homeContent: homeStartingContent, posts: foundPost });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const compose = new Journal({
    name: req.body.titleInput,
    content: req.body.composeInput,
  });
  compose.save();

  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const postDelete = req.body.postId
  Journal.findOneAndRemove({_id: postDelete}).then(function() {
    console.log('Successful deleted.');
    res.redirect("/");
  })
  
  
});

app.get("/posts/:postId", (req, res) => {
  const postId = _.lowerCase(req.params.postId);

  Journal.find().then(function (foundPost) {
    foundPost.forEach(function (element) {
      const postTitle = _.lowerCase(element.id);
      if (postId === postTitle) {
        res.render("post", { title: element.name, content: element.content, id: element.id });
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
