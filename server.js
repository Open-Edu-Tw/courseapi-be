import dotenv from "dotenv-defaults";
dotenv.config();

import express from 'express';  
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 4000;

// GET request
app.get('/getCourse/:name', async (req, res) => {
    const name = req.params.name
    console.log(req.url);
    console.log(name);
    
    const regex = new RegExp(name, "i");
    const existing = await Course.find({ name: {$regex: regex}});
    res.status(200).send({ msg: 'OK', detail: existing })
});



// Run test
app.listen(port, () =>
  console.log(`API started on port ${port}!`),
);

// Import mongoose
import mongoose from 'mongoose';

// Import model and schema
import Course from './models/Course.js'

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("MongoDB connection has been created."));

  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
  db.once("open", async () => {     
  });

