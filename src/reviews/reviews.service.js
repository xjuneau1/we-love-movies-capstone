const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const mapCritics = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
})

function addCritics(review_id){
    return knex("reviews as r")
    .join("critics as c","r.critic_id","c.critic_id")
    .select("r.*","c.*")
    .where({ review_id })
    .first()
    .then(mapCritics)
}

function read(review_id){
    return knex("reviews")
    .select("*")
    .where({ review_id })
    .first()
}

function update(updatedReview){
    return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
}

function destroy(review_id){
    return knex("reviews")
    .where({ review_id })
    .del();
}

module.exports={
    read,
    update,
    delete: destroy,
    addCritics
}