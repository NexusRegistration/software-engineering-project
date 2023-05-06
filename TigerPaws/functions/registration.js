//document.addEventListener("DOMContentLoaded", function() {
  //$(document).ready(function() { 
    function addToList(button) {
        console.log("Running");
        // Get the class ID from the data-class-id attribute
        const classId = $(button).data('class-id');

        console.log(classId);
      
        // Call the addToListfunction with the class ID
        $.post('/register', { classId: classId }, function (response) {
            // Display a message based on the response
            alert(response);
            location.reload();
        });
    }
  //})
//})

  