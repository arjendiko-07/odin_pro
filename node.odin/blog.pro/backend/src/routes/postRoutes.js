const express= require('express');
const router = express.Router();
const verifyToken=require('../middleware/auth');
const{
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
}=require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, deletePost);

module.exports=router;