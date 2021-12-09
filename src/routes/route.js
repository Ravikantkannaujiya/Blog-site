const express = require('express');
const router = express.Router();

const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")
const middlewares = require("../Middleware/loginmiddleware.js")

router.post('/createAuthor', middlewares.emailValidator ,authorController.createAuthor);
router.post('/loginforblog', blogController.loginforblog);
router.post('/createBlog',middlewares.activityToken, blogController.createBlog);
router.get('/getAllBlogs', middlewares.activityToken,blogController.getAllBlogs);
router.put('/updateBlogWithNewFeatures/:blogId', middlewares.activityToken, blogController.updateBlogWithNewFeatures);
router.post('/deleteBlogById/:blogId' , middlewares.activityToken,blogController.deleteBlogById);
router.post('/deleteBlogByAttribute', middlewares.activityToken, blogController.deleteBlogByAttribute);


module.exports = router;