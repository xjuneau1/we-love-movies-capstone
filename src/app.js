if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
const notFound = require("./errors/notFound")
const errorHandle = require("./errors/errorHandle")

const moviesRouter = require("./movies/movies.router")

app.use(express.json())
app.use(cors())

app.use("/movies", moviesRouter)

app.use(notFound)
app.use(errorHandle)


module.exports = app;
