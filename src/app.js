if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
const notFound = require("./errors/notFound")
const errorHandle = require("./errors/errorHandle")

const moviesRouter = require("./movies/movies.router")
const theatersRouter = require("./theaters/theaters.router")
const reviewsRouter = require("./reviews/reviews.router")

app.use(express.json())
app.use(cors())

app.use("/movies", moviesRouter)
app.use("/theaters", theatersRouter)
app.use("/reviews", reviewsRouter)

app.use(notFound)
app.use(errorHandle)


module.exports = app;
