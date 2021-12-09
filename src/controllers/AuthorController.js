const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const authorModel = require("../models/authorModel");

const checkforbody = function (value) {
    let check = Object.keys(value).length > 0; //Object.keys(objectname)=> gives array of keys. If we add .length than it will give length of keys.
    return check; //check=> contain true or false depend upon req.body [if req.body=empty=>False] or [if req.body=something=>True]
}

const validDetail = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
    if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
    if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const validfortitle = function (value) {
    if (['Mr', 'Mrs', 'Miss', 'Mast'].indexOf(value) == -1) { return false } //mean's he have not found it
    if (['Mr', 'Mrs', 'Miss', 'Mast'].indexOf(value) > -1) { return true }   //mean's he have found it
}

const createAuthor = async function (req, res) {
    try {
        const authorDetail = req.body;
        if (!checkforbody(authorDetail)) {
            return res.status(400).send({ status: false, message: 'Please provide author details' })
        }

        const { fname, lname, title, email, password } = authorDetail //object destructuring => becz it will be easy to use for checking perpuse now we can use "fname" in place of req.body.fname
        if (!validDetail(fname)) {
            return res.status(400).send({ status: false, message: 'first name is required' })
        }
        if (!validDetail(lname)) {
            return res.status(400).send({ status: false, message: 'Last name is required' })
        }

        if (!validDetail(title)) {
            return res.status(400).send({ status: false, message: 'title is required' })
        }
        if (!validfortitle(title)) {
            return res.status(400).send({ status: false, message: 'Please fill anyone of them-[Mr, Mrs, Miss, Mast]' })
        }

        if (!validDetail(email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
        }

        const isEmailAlreadyUsed = await authorModel.findOne({ email }); // {email: email} object shorthand property

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }

        if (!validDetail(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }
        let createAuthor = { fname, lname, title, email, password }; //this is done becz to have only those feild which passes the above criteria and put all those feild into a object.
        let savedAuthor = await authorModel.create(createAuthor);
        res.status(201).send({ status: true, message: "Author created successfully", data: savedAuthor });
    }
    catch (error) {
        console.log({ ErrorIs: error.message })
        res.status(500).send({ status: false, Errormsg: error.message })
    }
};
//----------------------------------------------login-------------------------------------------

const loginforblog = async function (req, res) {
    try {
        let loginbody = req.body;
        if (!checkforbody(loginbody)) {
            return res.status(400).send({ status: false, message: 'Please provide email and password details' })
        }

        const { email, password } = loginbody
        if (!validDetail(email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
        }
        if (!validDetail(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        const User = await authorModel.findOne({ email, password, isDeleted: false });
        if (!User) {
            return res.status(401).send({ status: false, msg: "invalid name or password" });
        }

        let payload = {
            authorId: Users._id,
            iat: Math.floor(Date.now() / 1000), //	The iat (issued at) identifies the time at which the JWT was issued. [Date.now() / 1000 => means it will give time that is in seconds(for January 1, 1970)] (abhi ka time de gha jab bhi yhe hit hugha)
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 //The exp (expiration time) identifies the expiration time on or after which the token MUST NOT be accepted for processing.   (abhi ke time se 10 ganta tak jalee gha ) Date.now() / 1000=> seconds + 60x60min i.e 1hr and x10 gives 10hrs.
        };

        let token = jwt.sign(payload, "radium");

        res.header("x-api-key", token);

        res.status(200).send({ status: true, message: "Author is loged in successfully", data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.createAuthor = createAuthor;
module.exports.loginforblog = loginforblog;