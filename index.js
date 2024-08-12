// const express = require("express");
// const mongoose = require("mongoose");

// const cors = require("cors");

// const port = 4000;

// require("dotenv").config();

// //Routes Middleware
// const userRoutes = require("./routes/user");
// const postRoutes = require("./routes/post");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cors());

// const corsOptions = {
//     origin: ["https://blog-client-liart.vercel.app/","https://blog-client-ayas-projects-393c05ff.vercel.app/","https://blog-client-git-main-ayas-projects-393c05ff.vercel.app/"],
//     credentials: true,
//     optionsSuccessStatus: 200
// }

// mongoose.connect(process.env.MONGODB_STRING);

// mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"))

// app.use("/posts", postRoutes);
// app.use("/users", userRoutes);

// if(require.main === module){
//     app.listen(process.env.PORT || port, () => {
//         console.log(`API is now online on port ${ process.env.PORT || port }`)
//     });
// }

// module.exports = {app,mongoose};


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 4000;
require("dotenv").config();

// Routes Middleware
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
    origin: [
        "https://blog-client-liart.vercel.app",
        "https://blog-client-ayas-projects-393c05ff.vercel.app",
        "https://blog-client-git-main-ayas-projects-393c05ff.vercel.app"
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// Routes
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Start server
if (require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log
