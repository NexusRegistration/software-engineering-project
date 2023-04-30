// Load required modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path')

// Create express app
const app = express();

// Set up middleware
app.use(express.static('public'));
app.use('/Resources', express.static('Resources'));
app.use('/views/CSS', express.static('CSS'));

// Set up session - used for user authentication
app.use(session({
    secret: 'randomString',
    resave: false,
    saveUninitialized: false,
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

// Connect to database
mongoose.connect('mongodb+srv://audreydeering:matbis-viqqu6-pArjyz@clustersoftwareengineer.mql7prx.mongodb.net/webAppDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", function () {
    console.log("Connected successfully");
})


/*
For the routers I am keeping the route prefix in case someone wants to 
come back and divide everything into separate files and make it all pretty.
For now, every route that was in this file was just moved into its own router file.
*/

// Load Routers 
const RouterViews = require("./routes/allTheRoutes");

// Use View Routers
app.use('/', RouterViews);

// Load API routers
const RouterCourses = require("./api/routes/courses")
const RouterUsers = require("./api/routes/users")

// Use API Routers
app.use('/', RouterUsers);
app.use('/', RouterCourses);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});