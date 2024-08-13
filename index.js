// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // [Environment Setup] 
// require("dotenv").config();

// // [Server setup] 
// const port = 4000;
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const corsOptions = {
//     origin: [
//         "https://blog-client-liart.vercel.app",
//         "https://blog-client-ayas-projects-393c05ff.vercel.app",
//         "https://blog-client-git-main-ayas-projects-393c05ff.vercel.app"
//     ],
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 200
// };

// // Use CORS middleware with options
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_STRING);

// mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// // [Routes]
// const userRoutes = require("./routes/user");
// const postRoutes = require("./routes/post");

// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);

// // [Error handling middleware]
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// // [Start server]
// if (require.main === module) {
//     app.listen(process.env.PORT || port, () => {
//         console.log(`API is now online on port ${process.env.PORT || port}`);
//     });
// }

// module.exports = { app, mongoose };

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Using axios for making HTTP requests
require("dotenv").config();

// [Server setup]
const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: [
        "https://blog-client-liart.vercel.app",
        "https://blog-client-ayas-projects-393c05ff.vercel.app",
        "https://blog-client-git-main-ayas-projects-393c05ff.vercel.app"
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Example route using axios
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get('https://blog-server-nhh1.onrender.com/users');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ type: 'error', message: error.message });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_STRING)
    .then(() => console.log("Now connected to MongoDB Atlas"))
    .catch(err => console.error("Failed to connect to MongoDB Atlas:", err));

// [Routes]
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// [Error handling middleware]
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ type: 'error', message: 'Something broke!' });
});

// [Start server]
const serverPort = process.env.PORT || port;
app.listen(serverPort, () => {
    console.log(`API is now online on port ${serverPort}`);
});

module.exports = { app, mongoose };
