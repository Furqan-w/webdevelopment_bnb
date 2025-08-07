const User = require("../models/user.js");



module.exports.SignUp= async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust! You are now logged in.");
      res.redirect("/listings"); 
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};


module.exports.afterLogin=async (req, res) => {
    req.flash("success", "Welcome back! You are now logged in.");
    const redirectUrl = res.locals.redirectUrl || '/listings';
    delete req.session.redirectUrl; // Clean up the session
    res.redirect(redirectUrl);
}

module.exports.Tologout=(req, res,next)  => {

  req.logout((err)=>{
    if (err) {
      next(err);
      console.log(err);
      req.flash("error", "Logout failed. Please try again.");
      return res.redirect("/listings");
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
  

  
};