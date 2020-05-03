const express = require("express")

const router = express.Router();

const Post = require('./../models/post');

router.post("", (req, res, next) => {
    const post = new Post({ title: req.body.title, content: req.body.content});
    post.save()
    .then((result)=>{
      console.log(result);
      res.status(201).json({
        message: 'Post added successfully',
        postId:result._id
      });
    });
    console.log(post);
  });
  
  router.put("/:id", (req, res, next) => {
    
    const post = new Post({ _id:req.body.id, title: req.body.title, content: req.body.content});
    console.log(`Updatin post: ${req.body.id} // %${req.params.id}`);
    Post.updateOne({_id: post._id}, post)
    .then((documents) => {
      console.log(documents)
      res.status(200).json({
          message: "Update successfully!",
          posts: documents
        });
      })
      .catch(e => console.error(`Error updating post!! ${e}`))
  });
  
  router.get("", (req, res, next) => {
    Post.find()
    .then((documents)=>{
      console.log(documents)
      res.status(200).json({
          message: "Posts fetched successfully!",
          posts: documents
        });
    });
  });
  
  router.get("/:id", (req, res, next) => {
    console.log(req.params.id)
    Post.findById(req.params.id)
    .then((post)=>{
      if (post) {
        res.status(200).json(post);
      }else{
        res.status(404).json({
          message: `No Post for id:${req.params.id}`,
        });
      }
    });
  });
  
  router.delete("/:id", (req, res, next) => {
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

  module.exports = router;