import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    name: String,
    url: String,
    instructor: Array,
    description: String,
    providerInstitution: String,
    source: String,
});
const Course = mongoose.model('course', CourseSchema);

export default Course;
