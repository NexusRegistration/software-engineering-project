const express = require("express");
//Requiring model so that it is using the course schema 
const courseModel = require("../models/courseModels");

const router = express.Router();
const path = require('path');

//at route "/courses" log all the courses in collection
router.get("/courses", async (req, res) => {
    const courses = await courseModel.find({});
    try {
        console.log("Printing all courses:")
        console.log(courses)
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
  })

  router.post("/courseSearch", async(req, res) => {
    //Gets the input from the search box on the search page, currently just takes course number
    const course = req.body.course
    
    //Checks the database based on course and puts all matches into an array
    const courseMatches = await courseModel.find({courseNum: course}).exec();

    //Checks if the array is empty, if it is then return to search page, if not then render list page with the info from course matches
    if(courseMatches.length == 0){
      console.log("No course found. Try harder please")
      res.render(path.join(__dirname, '/../../views/pages/course-search-page.ejs'))
    } else {
      res.render(path.join(__dirname, '/../../views/pages/course-list-page.ejs') , {courses:courseMatches})
    }
    //print courses into log
  })

  router.post("/addCourse", async(req, res) => {

    //This big block gets all the data from the form and makes it into a usable form
    const courseName = req.body.courseName
    const courseNum = req.body.courseNum
    const courseDept = req.body.dept
    const courseInstrutor = req.body.courseInstrutor
    const courseHours = req.body.courseHours
    const coursePathways = req.body.coursePathways
    const coursePrereqs = req.body.coursePrereqs
    const courseBulding = req.body.courseBulding
    const courseRoomNum = req.body.courseRoomNum
    const courseMeetingDays = req.body.courseMeetingDays
    const courseDescription = req.body.courseDescription
    //COURSE SECTION NEEDS TO BE ADDED, IT IS CURRENTLY ALWAYS ADDED AS 1
    //ALSO LIKE, ACTUALLY ADDING THE COURSE NEEDS TO BE ADDED
  })

module.exports = router;