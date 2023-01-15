const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

const addCategory = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
})

function list(){
    return knex("movies")
    .select("*")
}

function showingList(is_showing){
    return knex("movies as m")
    .distinct()
    .join("movies_theaters as mt", "m.movie_id","mt.movie_id")
    .select("m.movie_id","m.title","m.runtime_in_minutes","m.rating","m.description","m.image_url")
    .where({ "mt.is_showing": true })
}

function read(movie_id){
    return knex("movies")
    .select("*")
    .where({movie_id})
    .first();
}

function theaterByMovieId(movie_id){
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m","m.movie_id","mt.movie_id")
    .select("t.*","mt.is_showing","m.movie_id")
    .where("m.movie_id", movie_id)
}

function reviewForMovie(movie_id){
    return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c","r.critic_id","c.critic_id")
    .select("r.*","c.*")
    .where("m.movie_id", movie_id)
    .then((res) => res.map(addCategory))
}

module.exports = {
    list,
    showingList,
    read,
    theaterByMovieId,
    reviewForMovie,
}