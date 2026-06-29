const router = require("express").Router();
const userController=require("../controllers/userController");

router.post("/follow", userController.followUser);
router.post("/unfollow", userController.unfollowUser);
router.get("/search", userController.searchUsers);
module.exports=router;