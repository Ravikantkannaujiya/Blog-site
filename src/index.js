const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const midglobal=function(req,res,next){
console.log(`${new Date().getFullYear()+"-"+(new Date().getMonth()+1) +"-"+new Date().getDay()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()} ${req.ip} ${req.originalUrl}`);
    next();
}
app.use(midglobal);

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://monty-python:SnYUEY4giV9rekw@functionup-backend-coho.0zpfv.mongodb.net/RaviKantKannaujiya123_db?authSource=admin&replicaSet=atlas-60843q-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});