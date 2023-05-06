const express = require("express");
const userModel = require("../models/userModels");
const courseModel = require("../models/courseModels");
const { userTypes } = require('../../functions/authentication/authentication');

const { default: mongoose } = require('mongoose');
const path = require('path');

const router = express.Router();

router.post("/userLogin", async(req, res) => {
  const { email, pwd } = req.body;

  const userMatches = await userModel.find({email: email});

  if (userMatches.length > 1) {
    return res.status(401).json({ error: 'Multiple Users with same email'});
  }

  if (userMatches.length == 0) {
    let alert = require('alert');
    alert("Username incorrect.")
    console.log("No such user found. Make sure username and password are correct.");
    return res.redirect('/');
  }

  const user = userMatches[0];

  // CHECK PASSWORD

  if (user.password != pwd) {
    let alert = require('alert');
    alert("Invalid password.")
    console.log("Invalid Password");
    return res.redirect('/');
  }

  // REDIRECT DIFFERENT USERS

  if (user.userType === userTypes.STUDENT) {
    req.session.user = user;
    return res.redirect('/student-page');
  } else if (user.userType === userTypes.PROFESSOR) {
    req.session.user = user;
    return res.redirect('/professor-page');
  } else if (user.userType === userTypes.ADMIN) {
    req.session.user = user;
    return res.redirect('/administrator-remake');
  }
  
  return res.status(401).json({ error: 'No user type found'});
});

router.post("/register", async(req, res) =>{
  try{
      //console.log("Inside /register post");
      const classId = new mongoose.Types.ObjectId(req.body.classId);
      console.log(classId);
      //console.log("After ObjectID call");
      const USER = req.session.user
      
      if (USER){
        const userId = req.session.user._id;
        //console.log(userId);

        const savedUser = await addToList(userId, classId);

        console.log(savedUser.message);
        //let alert = require('alert');
        //alert(savedUser.message)
        res.send(savedUser.message);

        // When I try to render another page, I get a "Cannot set headers error"
        /*const student = await userModel.findById(userId);
        const courses = student.registeredCourses;
        console.log(courses)
        if(courses){
          res.render('pages/manage-courses-student', {courses});
        }*/

      } else {
        let alert = require('alert');
        alert("Username or password incorrect.")
        console.log("No one is currently logged in so you cannot be registered for a class.");
      }
      //console.log("Before res render");
      //res.render(path.join(__dirname, '/../../views/pages/student-page.ejs'))
      //return res.redirect('/student-page');
      //console.log("After res render");
  } catch (err) {
      //Handle Errors
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});  

async function addToList(studentId, classId) {
  try {
    const student = await userModel.findById(studentId);
    const classObj = await courseModel.findById(classId);
    let classCheck = 1;

    for(let i = 0; i < student.registeredCourses.length; ++i){
      if(student.registeredCourses[i] === classObj.name) classCheck = 0;
    }
    //console.log(classCheck);

    if(classCheck){
      console.log("\nAdding " + classObj.name + " to " + student.username.first + "'s Class List\n");

      student.registeredCourses.push(classObj.name);

      console.log(student);

      // Save the updated student document to the User collection
      await student.save().catch(err => {
        console.error('Error saving student:', err);
        throw err;
      });

      return {
        success: true,
        message: `The class "${classObj.name}" has been added to ${student.username.first}'s class list.`
      };
    } else {
      return {
        success: false,
        message: 'You have already registered for this class!'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

/*router.post("/register", async(req, res) =>{

    //Gets info from the HTML form
    const email = req.body.email //We use email because it should be unique for every user
    const password = req.body.password //To make sure people cant just sign anyone up for any class
    const course = req.body.course //This is hopefully a stand in until we can implement a better method

    //Access user database, if we have a user then add course to the database
  

    const userMatches = await userModel.find({email: email,password: password}).exec();

    if(userMatches.length == 0) {
      let alert = require('alert');
      alert("Username or password incorrect.")
      console.log("No such user found. Make sure email or password is correct")
      res.render(path.join(__dirname, '/../../views/pages/register.ejs'))
    } else {

      const courseMatch = await courseModel.find({name: course})

      if(courseMatch.length == 0){
        let alert = require('alert');
        alert("No course found, make sure course name is correct.");
        res.render(path.join(__dirname, '/../../views/pages/register.ejs'))
        console.log("No course found, Make sure course name is correct")

      } else {
        user = userMatches[0] //Get the one user out of the Array

        const filter = {email: email}
  
        const updateDoc = {
          $push: {
            registeredCourses: course
          }
        }
        
        const result = await userModel.updateOne(filter, updateDoc)
        console.log("Got here")
        console.log(result)
        
        let alert = require('alert');
        alert("Registered Successfully.")
        res.render(path.join(__dirname, '/../../views/pages/student-page.ejs'))
      }
      }
  })*/

  router.post("/deregister", async(req, res) =>{
  })

  router.post("/studentunregister",async(req,res) =>{
    //Gets info from the HTML form
    const email = req.body.email //We use email because it should be unique for every user
    const password = req.body.password //To make sure people cant just sign anyone up for any class
    const course = req.body.course //This is hopefully a stand in until we can implement a better method

    //Access user database, if we have a user then add course to the database
  

    const userMatches = await userModel.find({email: email,password: password}).exec();

    if(userMatches.length == 0) {
      let alert = require('alert');
      alert("Username or password incorrect.")
      console.log("No such user found. Make sure email or password is correct")
      res.render(path.join(__dirname, '/../../views/pages/studentunregister.ejs'))
    } else {

      const courseMatch = await courseModel.find({name: course})

      if(courseMatch.length == 0){
        let alert = require('alert');
        alert("No course found, make sure course name is correct.");
        res.render(path.join(__dirname, '/../../views/pages/studentunregister.ejs'))
        console.log("No course found, Make sure course name is correct")

      } else {
        user = userMatches[0] //Get the one user out of the Array

        const filter = {email: email}
  
        const updateDoc = {
          $pull: {
            registeredCourses: course
          }
        }
        
        const result = await userModel.updateOne(filter, updateDoc)
        console.log("Got here")
        console.log(result)
        
        let alert = require('alert');
        alert("Removed Course Successfully.")
        res.render(path.join(__dirname, '/../../views/pages/student-page.ejs'))
      }
      }
  })

  

module.exports = router;