const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const{saverediredtedUrl}=require("../middleware.js");
const Usercontroller=require("../controllers/users.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup",Usercontroller.SignUp);



router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});


router.post("/login", saverediredtedUrl,
   passport.authenticate('local',{failureRedirect:'/login',failureFlash:true }),
   Usercontroller.afterLogin
);

router.get("/logout",Usercontroller.Tologout );

module.exports = router;
