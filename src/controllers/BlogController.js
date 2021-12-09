const mongoose = require('mongoose')
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");

const checkfordetails = function (value) {
    let check = Object.keys(value).length > 0; //Object.keys(objectname)=> gives array of keys. If we add .length than it will give length of keys.
    return check; //check=> contain true or false depend upon req.body [if req.body=empty=>False] or [if req.body=something=>True]
}

const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
    if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)   //for checking authorId which is comming from request body is correct or not or user and put some random value to it.
}

const isValidArray = function (arrayToCheck) {
    return Array.isArray(arrayToCheck)         //The Array.isArray(arrayToCheck) method returns true if an arrayToCheck is an array, otherwise false.
}

const createBlog = async function (req, res) {
    try {
        let blogfrombody = req.body
        if (!checkfordetails(blogfrombody)) {
            return res.status(400).send({ status: false, message: 'Please provide blog details' })
        }

        const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody; //object destructuring => becz it will be easy to use for checking perpuse now we can use "title" in place of req.body.title.

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Blog Title is required' })
            return
        }

        if (!isValid(body)) {
            res.status(400).send({ status: false, message: 'Blog body is required' })
            return
        }

        if (!isValid(authorId)) {
            res.status(400).send({ status: false, message: 'Author id is required' })
            return
        }

        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, message: `${authorId} is not a valid author id` })
            return
        }

        if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'Blog category is required' })
            return
        }

        const author = await authorModel.findById(authorId);

        if (!author) {
            res.status(400).send({ status: false, message: `Author does not exit` })
            return
        }
        if (!isValidArray(tags)) {
            res.status(400).send({ status: false, message: 'Blog tags is required' })
            return
        }
        if (!isValidArray(subcategory)) {
            res.status(400).send({ status: false, message: 'Blog subcategory is required' })
            return
        }

        if (isPublished == true) {
            let blogData = { title, body, authorId, tags, category, subcategory, isPublished, publishedAt: new Date() };
            const newBlog = await blogModel.create(blogData)
            return res.status(201).send({ status: true, message: 'New blog created successfully', data: newBlog })
        }

        if (isPublished == false) {
            let blogData = { title, body, authorId, tags, category, subcategory, isPublished };
            const newBlog = await blogModel.create(blogData)
            return res.status(201).send({ status: true, message: 'New blog created successfully', data: newBlog })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}

const getAllBlogs = async function (req, res) {
    try {
        const queryParams = req.query
        if (!checkfordetails(queryParams)) {
            return res.status(400).send({ status: false, message: 'Please provide blog details' })
        }
        const { authorId, category, tags, subcategory } = req.query

        let query = {};
        if (isValid(authorId) && isValidObjectId(authorId)) {
            query['authorId'] = authorId;
        }
        if (isValid(category)) {
            query['category'] = category.trim();

        }
        if (isValid(tags)) {
            query['tags'] = tags.trim();

        }
        if (isValid(subcategory)) {
            query['subcategory'] = subcategory.trim();
        }

        let blogs = await blogModel.find(query)
        if (Array.isArray(blogs) && blogs.length === 0) {   //this sitution is for when the user gives details but details does not matches with any of the blogs.
            return res.status(404).send({ status: false, message: 'No blogs found' })
        }

        query.isDeleted = false      //for finding only those blogs which are not deleted and they are publish.
        query.isPublished = true
        let allblogs = await blogModel.find(query)     //this time this sitution is for when we found that blog given details are valid now we will show only those data which are not deleted and are publish with query in it.
        res.status(200).send({ status: true, message: 'Blogs list', data: allblogs })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const updateBlogWithNewFeatures = async function (req, res) {
    try {
        const requestBody = req.body
        const blogId = req.params.blogId
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
        }
        if (!isValidObjectId(authorIdFromToken)) {
            return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
        }
        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false })

        if (!blog) {
            res.status(404).send({ status: false, message: `Blog not found` })
            return
        }

        if (blog.authorId.toString() !== authorIdFromToken) { //here when blog.authorId will come we will convert it to the string for our safity and for easily check with others.
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        if (!checkfordetails(requestBody)) {
            res.status(200).send({ status: true, message: 'No paramateres passed. Blog unmodified', data: blog })
            return
        }

        const { title, body, tags, subcategory, isPublished } = requestBody;

        if (isValid(title)) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { title: title } }, { new: true })
        }
        if (isValid(body)) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { body: body } }, { new: true })
        }
        if (isValid(tags) && isValidArray(tags)) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $addToSet: { tags: { $each: tags } } }, { new: true })
        }
        if (isValid(subcategory && isValidArray(subcategory))) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $addToSet: { subcategory: { $each: subcategory } } }, { new: true })
        }
        if (isPublished == true) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { isPublished: isPublished, publishedAt: new Date() } }, { new: true })
        }
        if (isPublished == false) {
            await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { isPublished: isPublished } }, { new: true })
        }

        const updatedBlog = await blogModel.findById({ _id: req.params.blogId });
        return res.status(200).send({ status: true, msg: "Blog updated successfully", data: updatedBlog });

    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" });

    }
};

const deleteBlogByID = async function (req, res) {
    try {
        const blogId = req.params.blogId
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
            return
        }

        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false })

        if (!blog) {
            res.status(404).send({ status: false, message: `Blog not found` })
            return
        }

        if (blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: `Blog deleted successfully` })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const deleteBlogByAttribute = async function (req, res) {
    try {
        const queryParams = req.query
        const authorIdFromToken = req.authorId
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }

        if (!checkfordetails(queryParams)) {
            return res.status(400).send({ status: false, message: 'Please provide blog details' })
        }
        const { authorId, category, tags, subcategory, isPublished } = req.query

        let query = {};
        if (isValid(authorId) && isValidObjectId(authorId)) {
            query['authorId'] = authorId;
        }
        if (isValid(category)) {
            query['category'] = category.trim();
        }
        if (isValid(tags)) {
            query['tags'] = tags.trim();

        }
        if (isValid(subcategory)) {
            query['subcategory'] = subcategory.trim();
        }
        if (isPublished) {
            query['isPublished'] = isPublished;
        }

        let checkvalidauthor = await blogModel.find(query)
        let validAuthor = checkvalidauthor.filter((blog) => {
            return blog.authorId == authorIdFromToken
        })
        if (!validAuthor) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        //this 263 line is written in down because first this api should say u r authorized or not --- and ---than it should say that blog found or not
        if (!checkvalidauthor) {
            return res.status(404).send({ status: false, message: `Blog not found` })
        }
        let blog = await blogModel.findOneAndUpdate(query, { isDeleted: true, deletedAt: new Date() }, { new: true });
        res.status(200).send({ status: true, message: 'Blog(s) deleted successfully' });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.deleteBlogByID = deleteBlogByID
module.exports.deleteBlogByAttribute = deleteBlogByAttribute
module.exports.updateBlogWithNewFeatures = updateBlogWithNewFeatures;
module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs