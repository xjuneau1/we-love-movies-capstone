const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["score", "content"];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidProperties = Object.keys(data).filter(
    (key) => !VALID_PROPERTIES.includes(key)
  );

  if (invalidProperties.length) {
    return next({
      error: 400,
      message: `Invalid properties: ${invalidProperties.join(", ")}`,
    });
  }
  next();
}

async function reviewExists(req, res, next){
    const review = await service.read(req.params.reviewId)
    if(review){
        res.locals.reviews = review
        return next();
    } else {
        next({ status: 404, message: "Review cannot be found."})
    }
}

async function list(req, res, next){
    res.json({ data: res.locals.review })
}

async function read(req, res, next){
    const reviewId = req.params.reviewId
    res.json({ data: await service.read(reviewId) })
}

async function update(req, res, next){
    const updatedReview = { ...req.body.data, review_id: res.locals.reviews.review_id }
    await service.update(updatedReview);
    const data = await service.addCritics(updatedReview.review_id)
    res.json({ data })
}

async function destroy(req, res, next){
    await service.delete(res.locals.reviews.review_id)
    res.sendStatus(204);
}

module.exports = {
    list: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
    update: [hasValidProperties, asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}