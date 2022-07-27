import dotenv from "dotenv-defaults";
dotenv.config();

import express from 'express';  
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 4000;

// api definition//   getCourse(req.body.name)
app.get('/getCourse/:name', (req, res) => {
    const name = req.params.name
    console.log(req.url);
    console.log(name);
    // const result = getCourse(name)
    res.status(200).send({ msg: 'OK', detail: getCourse(name) }) 
});



// run test
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

// import and connect db
import mongoose from 'mongoose';
// model import
import Course from './models/Course.js'

mongoose
  .connect(
    process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("mongo db connection created"));

  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
  db.once("open", async () => {     
  });

// funcitons
const getCourse = async (name) => {
    const existing = await Course.find({ name });
    
    if (existing) {
        return ""
    ;}
    try {
        console.log(`getCourse: ${name} searched successfully`);
        return existing
    } catch (e) { throw new Error("Finding error: " + e); }
};

const saveCourse = async (name, url, instructor, description, providerInstitution, source) => {
    const existing = await Course.find({ name });
    if (existing) throw new Error("Course ${name} exists!!");
    try {
      const newCourse = new Course({ name, url, instructor, description, providerInstitution, source });
      console.log("Created Course: ", name);
      return newCourse.save();
    } catch (e) { throw new Error("User creation error: " + e); }
  };
  
