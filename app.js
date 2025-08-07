require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const Listing = require('./models/listing.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require('./schema.js');
const reviewSchema = require('./schema.js');

const Review = require('./models/review.js');
const session = require('express-session'); 
const MongoStore = require('connect-mongo');

const flash = require('connect-flash'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); // Assuming you have a User model for authentication
const userRouter= require('./routes/user.js'); // User routes, if any



const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');







app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsmate);

const DBurl= process.env.ATLASDB_URL ;

const store=MongoStore.create({
    mongoUrl:DBurl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 60 * 60, 
});

app.get('/', (req, res) => {
    res.send("Hello World");
});
store.on('error', function (e) {
    console.log('Session Store Error', e);
});



const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, 
    }
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().catch(err => console.log(err));
async function main() {

    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(DBurl);
}

//code



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.get('/demouser',async(req,res)=>
    
{       
    let fakeuser=new User({
        email: "student@gmail.com",
        username: "demouser",
    });

    let reguser=await User.register(fakeuser, "demouser");
    res.send(reguser);
});
 



app.use('/listings', listingsRouter); 
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter); // User routes, if any

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    // res.status(status).render('listings/error.ejs', { status, message });
    res.render('listings/error.ejs', { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
