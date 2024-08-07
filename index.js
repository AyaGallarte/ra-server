const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const port = 4000;

require("dotenv").config();

//Routes Middleware
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/blog");

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"))

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${ process.env.PORT || port }`)
    });
}

module.exports = {app,mongoose};
