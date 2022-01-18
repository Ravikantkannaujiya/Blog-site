const express = require('express');
const router = express.Router();

const AuthorController= require("../controllers/AuthorController")
const BlogController= require("../controllers/BlogController")
const middlewares = require("../Middleware/loginmiddleware.js")

router.post('/createAuthor', middlewares.emailValidator ,AuthorController.createAuthor);
router.post('/loginforblog', BlogController.loginforblog);
router.post('/createBlog',middlewares.activityToken, BlogController.createBlog);
router.get('/getAllBlogs', middlewares.activityToken,BlogController.getAllBlogs);
router.put('/updateBlogWithNewFeatures/:blogId', middlewares.activityToken, BlogController.updateBlogWithNewFeatures);
router.post('/deleteBlogById/:blogId' , middlewares.activityToken,BlogController.deleteBlogById);
router.post('/deleteBlogByAttribute', middlewares.activityToken, BlogController.deleteBlogByAttribute);


module.exports = router;