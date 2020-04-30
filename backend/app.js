const express = require("express");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://dbLoebre:TestPa55@cluster0-rncbz.mongodb.net/node-angular?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{console.log('Conected to MongoDB')})
.catch(()=>{console.error("Failed to connect to MongoDB")});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({ title: req.body.title, content: req.body.content});
  post.save();
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
  .then((documents)=>{
    console.log(documents)
    res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
    if (!req.params || !req.params.id){
        res.status(400).json({
            message: "Wrong API!",
          });
    }

    Post.deleteOne({_id:req.params.id})
    .then(()=>{
        res.status(200).json({
            message: `Post ${req.params.id} deleted`,
          });
    })
    .catch((err) => {
        res.status(500).json({
            message: `${err}`,
        });
    });
});

module.exports = app;
