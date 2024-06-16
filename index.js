const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const env = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors');

const UserAuthRoute = require("./Routes/UserAuthRoutes")
const ProductRoutes =require("./Routes/ProductRoutes")
const SubUserRoutes = require("./Routes/SubUserRoutes")

const imageMiddleWare = require("./MiddleWare/Images")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

env.config()

app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


mongoose
    .connect(
        // "mongodb+srv://root:1234@Find@cluster0.ngra0hy.mongodb.net/?retryWrites=true&w=majority",
        // `mongodb+srv://root:${process.env.DATABASE_PASSWORD}@cluster0.gonzpgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        `mongodb+srv://zohaibhassan22002:${process.env.DATABASE_PASSWORD}@cluster0.xzn1q5f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,

        {
            useNewUrlParser: false,
            // useUnifiedTopology: true,

        }
    )
    .then(() => {
        console.log("Database is connected");
    });

const path = require("path");

app.use("/images", express.static(path.join(__dirname, "Images")));

app.post("/getImageUrl", imageMiddleWare.single("Image"), (req, res) => {
    try {
        const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`;
        res.status(200).json({
            status: 200,
            message: "success",
            imageUrl: imageUrl,
        });
    } catch (err) {
        res.status(400).json({
            message: "something wrong",
        });
    }
});
app.get('/', (req, res) => {
    res.send("Smart Api works fine")
})

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use("/user/api", UserAuthRoute);
app.use("/product/api", ProductRoutes);
app.use("/subuser/api", SubUserRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port # ${process.env.PORT}`);
});


