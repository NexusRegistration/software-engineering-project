const mongoose = require('mongoose')
//We probably need to change the structure of this document
//usernames in addition to user names
//I added email username field
const userSchema = new mongoose.Schema ({
   userType: String,
   username: {
    first: String,
    last: String,
   },
   password: String,
   coursesTaken: [String],
   registeredCourses: [String],
   email: String
})

const User = mongoose.model('User', userSchema)
module.exports = User