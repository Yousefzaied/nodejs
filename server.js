
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
const authMiddleware = require("./authMiddleware");

const url = process.env.MONGO_URL;
mongoose.connect(url);
const Course = require("./index");
app.use(cors())

// get all course
app.get("/courses", authMiddleware,async (req,res) => {

  const query = req.query;
    const limit = query.limit ||  10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const allCourses = await Course.find().limit(limit).skip(skip);

    // res.json(allCourses)
    res.json({status: "success" , data: {courses :allCourses}});
});

// get single course
app.get("/courses/:id", authMiddleware,async (req, res) => {
  try {

    const singleCourse = await Course.findById(req.params.id);

    if(!singleCourse) {
      return res.status(404).json({status: "fail", data: {course: "The Course Not found"}});
    }

    res.json({status: "success" , data: {course :singleCourse}});

  } catch(error) {
    console.log("Error!: ", error)
    res.status(500).json({status: "fail",course: "unable to communication with db"});
  } 
})

// create new course 
app.post("/courses", authMiddleware,async (req,res) => {
  try {
    const {title, price} = req.body;

    const newCourse = new Course({title, price});
    await newCourse.save();
    res.status(200).json(newCourse);
  } 
  catch(error) {
    console.log("Error!: ", error);
    res.status(500).json({mes: "Not Found"});
}});

// updta course
app.put("/courses/:id", authMiddleware,async (req, res) => {
  try {
    const{title, price} = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {title, price});

    // res.json(updatedCourse)
    res.json({status: "success", data: {course: updatedCourse}});


  } catch(error) {
    console.log("Error!", error);
    res.status(500).json({status:"error", msg: error});
  }
})

// delete course
app.delete("/courses/:id", authMiddleware,async (req, res) => {

  try {

    const deleted = await Course.findByIdAndDelete(req.params.id);
    res.json({status:"sucess", data: null})
  } catch(error) {
    console.log("Error!", error)
  }
})

app.listen(3000, () => {
  console.log("Server Is On Port 3000");
})