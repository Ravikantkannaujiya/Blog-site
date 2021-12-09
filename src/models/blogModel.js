const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is Required',
        trim: true
    },
    body: {
        type: String,
        required: 'Title is Required',
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
        required: 'AuthorId is Required'
    },
    tags: {
        type: [String],
        required: 'Tags is Required',
        trim: true
    },
    category: {
        type: String,
        required: 'Category is Required',
        trim: true
    },
    subcategory: {
        type: [String],
        required: 'subcategory is Required',
        trim: true
    },
    deletedAt: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });
module.exports = mongoose.model('blog', blogSchema)