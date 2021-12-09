var validator = require("email-validator");
const jwt = require("jsonwebtoken")
 
const emailValidator=async function(req,res,next){
    let Id=req.body.email
    let Idd=validator.validate(Id);
    console.log(Idd)
    if(Idd){
        next();
    }else{
        res.status(404).send('Please give valid email')
    }
}

const activityToken = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { //token nahi hai in the request body
            return res.status(403).send({ status: false, msg: "Missing authentication token in the request part" });
        }
        //if token is their in the req than it will go to next line
        let validtoken = jwt.verify(token, 'radium')
        if (!validtoken) { //after decode some other value is their than it will say invalid
            return res.status(403).send({ status: false, msg: "The token is invalid" })
        }
        req.validtoken = validtoken;       //here we have created a key value pair=> key=validtoken and value=validtoken
        next()                             //and send this key value pair in the request part
    }                                      // for the further use in the Api
    catch (error) {
        console.log({ ErrorIs: error.message })
        res.status(500).send({ status: false, Errormsg: error.message })
    }
}

module.exports.activityToken=activityToken;
module.exports.emailValidator = emailValidator