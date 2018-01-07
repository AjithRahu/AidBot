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

var user = "";
var uid = "";

// SIGN OUT 

$(document).ready(function () {
     $("body").prepend(
          '<div class="header">' +
     		'<span id="navopen"  onclick="openNav()">&#9776;</span>' +
     		'<div id="mySidenav" class="sidenav">'+
     		     "<div id='sidemenu'>" +
               		'<a href="javascript:void(0)" class="closebtn" id="navopen" onclick="closeNav()">&times;</a>' +
               		'<a href="calendar.html" id="acalendar">Calendar</a>' +
               		'<a href="settings.html" id="asettings">Settings</a>' +
               		'<a href="contact.html" id="acontact">Contact</a>' +
               		'<a href="prescription.html" id="aprescription">Prescriptions</a>' +
               		'<a href="upcoming.html" id="aupcoming">Upcoming Appointments</a>' +
               		'<a href="message.html" id="amessage">Message</a>' +
               	"</div>" +
          		'<button id="signOuts">Sign Out</button>' +
     		'</div>' +
     	'</div>');
     
     $("#signOuts").click(function() {
           //signout
          firebase.auth().signOut().then(function () {
               console.log('Signed Out');
          }, function(error) {
               console.error('Sign Out Error', error);
          });
   
     });
     
     firebase.auth().onAuthStateChanged(function(currentUser) {
          if (currentUser) {
               user = currentUser;
               uid = user.uid;
               console.log("logged in");
               var path = window.location.pathname;
               var pathArr = path.split("/");
               firebase.database().ref().child("users").child(uid).child("type").once("value").then(function(snap){
                    var accountType = snap.val();
                    if (pathArr[3] != accountType) {
                         pathArr[3] = accountType;
                         var newPath = pathArr.join("/");
                         window.open("https://" + window.location.hostname + newPath, "_self");
                    }
                    if (accountType == "doctor") {
                         $("#sidemenu").append('<a href="createAppointments.html" id="acreate">Create Appointments</a>');
                    }
               });
          }
          else {
               //redirect
               window.open("https://" + window.location.hostname + "/ajithrahu/aidbot/General/login.html", "_self");
          }
     });

});



// SIDEMENU 

function openNav() {
	// when the user clicks the side nav the width expands for 250px;
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
     // when the user closes the the side nav the width compress to 0px
    document.getElementById("mySidenav").style.width = "0";

}