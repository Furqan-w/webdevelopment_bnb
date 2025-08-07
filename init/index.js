const initdata=require('./data.js');
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');


main().catch(err => console.log(err));
 
async function main() 
{
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async ()=>{
     await Listing.deleteMany({});
     initdata.data=initdata.data.map((obj)=>({...obj,owner:'688ddbbbe993ceb94219de5a'}));
     await Listing.insertMany(initdata.data);
     console.log("Database initialized with sample data");
}

initDB().then(() => {
    console.log("Database initialized successfully");
    mongoose.connection.close();
}).catch(err => {
    console.error("Error initializing database:", err);
    mongoose.connection.close();
});