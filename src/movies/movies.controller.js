const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function movieExists(req, res, next){
    const movie = await service.read(req.params.movieId)
    
    if(movie){
        res.locals.movie = movie;
        return next();
    }
    next({ 
        status: 404, 
        message: "Movie cannot be found."
    })
    
}

async function list(req, res, next){
    const {is_showing} = req.query;
    if(is_showing === 'true'){
        res.json({ data: await service.showingList(is_showing)})
    }

    res.json({ data: await service.list() });
}

function read(req, res, next){
    res.json({ data: res.locals.movie })
}

async function getTheaterByMovie(req, res, next){
    const movie_id = req.params.movieId
    res.json({ data: await service.theaterByMovieId(movie_id)})
}

async function getMovieReviews(req, res, next){
    const movie_id = req.params.movieId
    console.log(movie_id)
    const reviewList = await service.reviewForMovie(movie_id)
    res.json({ data: reviewList })
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), read],
    getTheaterByMovie: [
        asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(getTheaterByMovie)
    ],
    getMovieReviews: [
        asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(getMovieReviews)
    ]
}