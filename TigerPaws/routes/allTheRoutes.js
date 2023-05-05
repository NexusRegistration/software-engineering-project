const express = require('express');
const courseModel = require("../api/models/courseModels");

const router = express.Router();
const { userTypes, restrictAccess } = require('../functions/authentication/authentication');

// Set up routes
router.get("/", (req, res) => {
    res.render('pages/login-remake');
});

router.get("/login", (req, res) => {
    res.render('pages/login-remake');
});

// this looks like a depricated page, doesn't need restricted access
router.get("/successfulLogin", (req, res) => {
    res.render('pages/successfulLogin');
});

router.get("/administrator-remake", restrictAccess(userTypes.ADMIN), (req,res) => {
    res.render('pages/administrator-remake');
});

router.get("/course-list-page", (req,res) => {
    res.render('pages/course-list-page');
});

router.get("/course-search-page", restrictAccess(userTypes.STUDENT), (req,res) => {
    res.render('pages/course-search-page')
});

router.get("/student-page", restrictAccess(userTypes.STUDENT), (req,res) => {
    res.render('pages/student-page')
});

router.get("/professor-page", restrictAccess(userTypes.PROFESSOR), (req,res) => {
    res.render('pages/professor-page-remake')
});

router.get("/administrator-addCourses", restrictAccess(userTypes.ADMIN), (req,res) => {
    res.render('pages/administrator-addCourses')
});

router.get("/administrator-removeCourses", restrictAccess(userTypes.ADMIN), (req,res) => {
    res.render('pages/administrator-removeCourses')
});

router.get("/help-page", restrictAccess(), (req,res) => {
    res.render('pages/help-page')
});

router.get("/register", restrictAccess(userTypes.STUDENT), (req, res) => {
    res.render('pages/register.ejs');
});

router.get("/manage-courses-student", restrictAccess(userTypes.STUDENT),async (req,res) => {
    try {
        const classes = req.session.user.registeredCourses;
        var courses = []
        for (x =0 ; x < classes.length; x++){
            const courseMatch = await courseModel.findOne({name: classes[x]}).populate().exec();
            courses.push(courseMatch);
        }
        console.log(courses);
        res.render('pages/manage-courses-student', {courses});
    }   
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
    
});

module.exports = router;