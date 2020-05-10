const Post = require('./../models/post');

exports.createPost = (req, res, next) => {
    const imageURL = req.protocol + '://' + req.get('host');
    const post = new Post({ 
      title: req.body.title,
      content: req.body.content,
      imagePath: imageURL + '/images/' + req.file.filename,
      creator: req.userData.userId
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
    })
    .catch( e => {
      console.log(post);
      res.status(500).json({message: `Error creating a post, e: ${e}`});
    });
  };

exports.editPost = (req, res, next) => {

    let imagePath = req.body.imagePath;

    if (req.file) {
      const imageURL = req.protocol + '://' + req.get('host');
      imagePath = imageURL + '/images/' + req.file.filename;
    }

    const post = new Post({ 
      _id:req.body.id,
       title: req.body.title,
       content: req.body.content,
       imagePath: imagePath,
       creator: req.userData.userId
    });

    Post.updateOne({_id: post._id, creator: req.userData.userId }, post)
    .then((documents) => {
        if (documents.n > 0){
          res.status(200).json({
              message: "Update successfully!",
              posts: documents
            });
        }else{
          res.status(404).json({
            message: "Not authorized!",
            posts: documents
          });
        }
      })
      .catch(e => {
        console.error(`Error updating post!! ${e}`);
        res.status(500).json({
          message: "Couldn't update post!"
        });
    });
  };

exports.getAllPosts = (req, res, next) => {

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
    })
    .catch(e => {
      console.error(`Error updating post!! ${e}`);
      res.status(500).json({
        message: "Fetching posts failed!"
      });
  });
};

exports.getPostById = (req, res, next) => {
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
    })    
    .catch(e => {
      console.error(`Error updating post!! ${e}`);
      res.status(500).json({
        message: "Fetching post failed!"
      });
  });
};

exports.deletePost = (req, res, next) => {
    if (!req.params || !req.params.id){
        res.status(400).json({
            message: "Wrong API!",
        });
    }

    Post.deleteOne({_id:req.params.id, creator: req.userData.userId })
    .then((result)=>{
      if (result.n > 0){
        res.status(200).json({
            message: "Deleted successfully!",
          });
      }else{
        res.status(404).json({
          message: "Not authorized!"
        });
      }
    })
    .catch((err) => {
        res.status(500).json({
            message: `${err}`,
        });
    });
};