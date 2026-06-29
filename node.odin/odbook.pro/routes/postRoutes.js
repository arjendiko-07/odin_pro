const router = require("express").Router();
const postController = require("../controllers/postController");

router.post("/create", postController.createPost);
router.post("/like", postController.likePost);
router.post("/comment", postController.commentPost);

module.exports=router;