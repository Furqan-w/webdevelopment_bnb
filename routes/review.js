const express = require("express");
const router = express.Router({ mergeParams: true }); // <-- THIS IS REQUIRED
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewsController = require("../controllers/review.js");



router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview)
);

router.delete(
  "/:reviewId/delete",isLoggedIn,isreviewAuthor,
  wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
