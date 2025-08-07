const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const listingsController = require("../controllers/listing.js");
const upload = multer({ storage }); // 'uploads/' is a folder in

router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(listingsController.createListing)
  );

router.get("/new", isLoggedIn, listingsController.renderForm);

router.get(
  "/search",
  wrapAsync(async (req, res) => {
    const { q } = req.query;
    const listings = await Listing.find({
      $or: [
        { country: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    });
    res.render("listings/index", { alllsitings: listings });
  })
);

router.get('/api/suggestions', wrapAsync(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const listings = await Listing.find({
    $or: [
      { country: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { title: { $regex: q, $options: "i" } }
    ]
  }).limit(5); // Limit suggestions
  res.json(listings);
}));

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

//edit listing route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.editListing)
);

module.exports = router;
