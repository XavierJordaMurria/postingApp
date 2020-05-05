const express = require("express")
const checkAuth = require('../middleware/check-auth');

const multer = require('multer');

const router = express.Router();


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',

}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if(!isValid){
      error = new Error(`Invalid mime type: ${file.mimetype}`);
    }

    cb(error, 'backend/images'); // reletive to the server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
});

const Post = require('./../models/post');

router.post(
  "",
  checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    const imageURL = req.protocol + '://' + req.get('host');
    const post = new Post({ 
      title: req.body.title,
      content: req.body.content,
      imagePath: imageURL + '/images/' + req.file.filename
    });

    post.save()
    .then((createdPost)=>{
      console.log(createdPost);
      res.status(201).json({
        message: 'Post added successfully',
        post:{
          id: createdPost._id,
          ...createdPost
        }
      });
    });
    console.log(post);
  });
  
  router.put(
    "/:id",
    checkAuth,
    multer({storage: storage}).single("image"),
    (req, res, next) => {

    let imagePath = req.body.imagePath;

    if (req.file) {
      const imageURL = req.protocol + '://' + req.get('host');
      imagePath = imageURL + '/images/' + req.file.filename;
    }

    const post = new Post({ 
      _id:req.body.id,
       title: req.body.title,
       content: req.body.content,
       imagePath: imagePath
    });

    console.log(`Updating post ${post} // %${req.params.id}`);
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

    const postQuery = Post.find();
    let fetchedPosts;
    console.log(req.query)
    if (req.query.pageSize && req.query.page){
      const pageSize = +req.query.pageSize;
      const currentPage = +req.query.page;
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    
    postQuery
    .then((documents)=>{
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
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
  
  router.delete("/:id", checkAuth, (req, res, next) => {
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