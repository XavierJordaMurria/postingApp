const express = require("express")
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

const postController = require('../controllers/posts');

router.post(
  "",
  checkAuth,
  extractFile,
  postController.createPost);
router.put(
  "/:id",
  checkAuth,
  extractFile,
  postController.editPost); 
router.get("", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;