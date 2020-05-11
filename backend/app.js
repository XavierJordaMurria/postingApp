const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const mongoose = require("mongoose");
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://dbLoebre:'+ process.env.MONGO_ATLAS_PW + '@cluster0-rncbz.mongodb.net/node-angular?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{console.log('Conected to MongoDB')})
.catch(()=>{console.error("Failed to connect to MongoDB")});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// any requests targetting /images will have access to the directory
app.use("/images", express.static(path.join("images"))); 

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes.routes);


module.exports = app;
