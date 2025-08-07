const Listing = require("../models/listing.js");

const Review = require("../models/review.js");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
      
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review created successfully!");

    res.redirect(`/listings/${req.params.id}`);
  };

  module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
  };