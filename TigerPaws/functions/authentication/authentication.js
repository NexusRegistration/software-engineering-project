const userTypes = {
  ADMIN: 'admin',
  PROFESSOR: 'professor',
  STUDENT: 'student'
};

const restrictAccess = (userType) => (req, res, next) => {
  if (typeof userType === 'undefined') {
    // If no specific user is passed in we just want to restrict the access to people not logged in
    if (!req.session.user) {
      // If no user is signed in
      console.log("no user");
      return res.redirect('/');
    }
  } else if (!req.session.user || req.session.user.userType !== userType) {
    // If the user is not authenticated or does not have the required role, redirect to the login page
    console.log("user not correct");
    return res.redirect('/');
  } 
  
  // If the checks pass
  return next();
};
  
module.exports = { userTypes, restrictAccess };