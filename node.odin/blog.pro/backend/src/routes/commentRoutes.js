const express=require('express');//imports express
const router = express.Router();//creates a router object
const verifyToken=require('../middleware/auth');
const {//imports controller functions
    getComments,
    createComment,
    deleteComment,
}=require('../controllers/commentController');

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', createComment);
router.delete('/:commentId/comments', verifyToken, deleteComment);

module.exports=router;