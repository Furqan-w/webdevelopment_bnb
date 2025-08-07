const Listing = require("../models/listing");

module.exports.index = async (req, resp) => {
  const alllsitings = await Listing.find({});

  resp.render("listings/index.ejs", { alllsitings });
};

module.exports.renderForm = (req, res) => {
  // res.send("New Listing Form");

  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);

  listing.owner = req.user._id;
  listing.image.url = url;
  listing.image.filename = filename;

  await listing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  // Generate a low-quality Cloudinary URL
  let originalImageUrl = listing.image.url;
  let lowQualityUrl = originalImageUrl;
  if (originalImageUrl && originalImageUrl.includes("cloudinary.com")) {
    // Insert transformation: q_20 (quality 20), w_300 (width 300px)
    lowQualityUrl = originalImageUrl.replace("/upload/", "/upload/q_20,w_100/");
  }
  res.render("listings/edit", { listing, originalImageUrl: lowQualityUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  let listinge = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listinge.image.url = url;
    listinge.image.filename = filename;
    await listinge.save();
  }

  req.flash("success", "Updated successfully!");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Post Deleted successfully!");

  res.redirect(`/listings`);
};
