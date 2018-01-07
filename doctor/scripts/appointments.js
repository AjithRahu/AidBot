(function () {
                 if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
                 if (window.ifaddtocalendar == undefined) { window.ifaddtocalendar = 1;
                     var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                     s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
                     s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
                     var h = d[g]('body')[0];h.appendChild(s); }})();

$(document).ready(function() {
     $("#aupcoming").remove();
});

var userId = "";

// View Appointments
function appointments() { 
    
   
   
   
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
             userId = user.uid;
             
             firebase.database().ref().once("value").then(function(snap){
             var infor = snap.val()
             // finds users data
             var userObj = infor.users[userId]; 
             var upcoming = userObj.upcoming;
             // finds all upcoming appointments that the user has
             var appointments = infor.appointments;      
             // pushes the objects of appointments into an array                
             var keys = Object.keys(userObj.upcoming);
             var array = [];
                            
             for (var i = 0; i < keys.length; i++) {
                 array.push(upcoming[keys[i]]);
                 
        }
        
           array.sort(function(a,b) { 
                            return new Date(a.time).getTime() - new Date(b.time).getTime() 
                         });
        
        // uses for loop to display appointments onto html page
        for( var i = 0; i < array.length; i++) {
             var appointment = appointments[array[i]];
             var patientId = appointment.patient;
             var patientName = infor.users[patientId].info.name;
             var postDetail = 
             "<div class='announcement col-md-3 wow zoomIn' id='delete'> " +
             "<h3>Date: " + appointment.date + "</h3>" +
             "<p>Time: " + appointment.time + "</p>" +
             "<p>Patient: " + patientName + "</p>" +
             "<p>Equipment: " + appointment.equipment + "</p>" +
             "<p>Notes: " + appointment.notes + "</p>"

           // Inserts the post into the designated div    
          document.getElementById("appointments").innerHTML += postDetail; 
               
          
        }
        
             });
         }
    });
     
} 
    
    
/*     
   var ref = new Firebase('https://yours.firebaseio.com/path/to/items/');
var now = Date.now();
var cutoff = now - 2 * 60 * 60 * 1000;
var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
var listener = old.on('child_added', function(snapshot) {
    snapshot.ref.remove();
});
   
   */
  /*
   var postDetail = 
                     "<div class='announcement col-md-3 wow zoomIn' id='delete'> " +
                     "<h3>Date: " + array[i].date + "</h3>" +
                     "<p>Time: " + array[i].time + "</p>" +
                     "<p>Patient: " + array[i].patient + "</p>" +
                     "<p>Equipment: " + array[i].equipment + "</p>" +
                     "<p>Notes: " + array[i].notes + "</p>" +
                        '<span class="addtocalendar atc-style-blue">'+
                         '<var class="atc_event">'+
                             '<var class="atc_date_start">2017-05-05 12:00</var>'+
                             '<var class="atc_date_end">2017-05-05 18:00</var>'+
                             '<var class="atc_timezone">Europe/London</var>'+
                             '<var class="atc_title">Star Wars Day Party</var>'+
                             '<var class="atc_description">May the force be with you</var>'+
                             '<var class="atc_location">Tatooine</var>'+
                             '<var class="atc_organizer">Luke Skywalker</var>'+
                             '<var class="atc_organizer_email">luke@starwars.com</var>'+
                         '</var>'+
                        '</span>' +
                     "</div>";
                     
                     
                     
                     
                     */
                     
                     
