
// Initialize Firebase
var config = {
apiKey: "AIzaSyBFdBsBP5rHwWZk3IoahVPbazgNgyF9Jn0",
authDomain: "aidbot-8252d.firebaseapp.com",
databaseURL: "https://aidbot-8252d.firebaseio.com",
projectId: "aidbot-8252d",
storageBucket: "aidbot-8252d.appspot.com",
messagingSenderId: "252474913333"
};
firebase.initializeApp(config);



var userObj = "ll";

// View Appointments
function appointments() {
    
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
             var uid = user.uid;
             firebase.database().ref().child("users").child(uid).once("value").then(function(snap){
                userObj = snap.val(); 
                alert(userObj.upcoming);

             });
         }
    });
     

     
    
   /* 
    
    //  For loop to find the users object in the array of student users  
     for (var i = 0; i < doctors.length; i++){
        if(doctor == doctor[i].name){
          var appointments = doctor[i].appointments;
        }
      
      }
      
    if (appointments == null) {
        alert("You have no scheduled appointments");
    } else {
    // Get Div where posts will be stored
        document.getElementById("appointments").innerHTML = null;
    
    // Get Posts from Local Storage         
        var appointments = JSON.parse(localStorage.getItem("appointments"));
        
    // For every post, it will be ordered in this arrangement    
        for (var i = 0; i < appointments.length; i++) {
         var postDetail = 
                    "<div class=' col-md-4 col-sm-12' id='delete'> " +
                    "<h1 class='titles'>" + posts[i].title + "</h1>" +
                    "<p>Date: " + posts[i].date + "</p>" +
                    "<p>Time: " + posts[i].time + "</p>" +
                    "<p>Location: " + posts[i].location + "</p>" +
                    "<p>Description: " + posts[i].description + "</p>" +
                    "<p>Posted By: " + posts[i].patient + "</p>" +
                    "</div>";
                  
                 // Inserts the post into the designated div    
                document.getElementById("appointments").innerHTML = document.getElementById("appointments").innerHTML + postDetail;

    }
    

      
                    
        } */   
    
}