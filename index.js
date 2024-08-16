const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// [Environment Setup] 
require("dotenv").config();

// [Server setup] 
const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: [
        "https://ra-ecommerce.vercel.app",
        "https://ra-ecommerce-ayas-projects-393c05ff.vercel.app",
        "https://ra-ecommerce-git-main-ayas-projects-393c05ff.vercel.app"
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions)); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [Routes]
const userRoutes = require("./routes/user.js");
const cartRoutes = require("./routes/cart.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// [Start server]
if (require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`);
    });
}

module.exports = { app, mongoose };
