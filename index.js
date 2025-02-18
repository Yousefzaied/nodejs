// password => zaied_123
// linkDB => mongodb+srv://youssefzaied587:zaied_123@cluster0.pmtaq.mongodb.net/

const mongoose = require("mongoose");


const CourseSchema = new mongoose.Schema({
    title:{type: String, required: true, minlength: 3, maxlength: 100},
    price:{type: Number, required: true, min: 0},
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;






