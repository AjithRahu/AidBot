$(document).ready(function() {
     $("#acreate").remove();
});

var userId = "";

/// Create Appointments
function patients() {
    


     // this function is used to find the doctors list of patients, then list them when creating an appointment    
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            // Getting users id  
            userId = user.uid;
            firebase.database().ref().child("users").child(userId).once("value").then(function(snap){
            var userObj = snap.val(); 
            // getting the list of patients the doctor has
            var patients = userObj.patients;
            var keys = Object.keys(userObj.patients);
           
            for( var i = 0; i < keys.length; i++) {
                 // each time the for loop runs, a different patient name is take for the variable "patient"
                 var patient =  patients[keys[i]];
                 // finds the patients data in the database
                 firebase.database().ref().child("users").child(patients[keys[i]]).once("value").then(function(snap) {
                      console.log(patients[keys[i]]);
                      var patientObj = snap.val();
                      // takes the patients data, then looks for the nanme
                      var patientName = patientObj.info.name;
                      // the patients name is set for the optionn 
                      var patientslist = "<option value=" + patient + ">" + patientName+ "</option>";
                      // patient  name is pushed into the html page 
                      document.getElementById("patientslist").innerHTML += patientslist;
          
                      
                 });
               
    
            }          
             
            });
            

        }

    });
    
    




}









function writeUserData() {
     //create variables
     var userObj = "";
     var patientName = document.getElementById("patientslist").value;
     var patientDate = document.getElementById("patientDate").value;
     var patientTime = document.getElementById("patientTime").value;
     var patientDateEnd = document.getElementById("patientDateEnd").value;
     var patientTimeEnd = document.getElementById("patientTimeEnd").value;
     var patientNotes = document.getElementById("patientNotes").value;
     var patientEquipment = document.getElementById("patientEquipment").value;
     
     // A patient must be selected in order to create an appointment     
     if (patientName == "Patients") {
          alert("Patient not selected");
          return
     }
       

       
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
             userId = user.uid;
          
          // creates a reference key for each appointment made          
             var appointmentkey = firebase.database().ref('appointments').push().key;
             
             // push all info as an appointment into the database with the reference key made
             firebase.database().ref('appointments').child(appointmentkey).set({
                  "patient": patientName, 
                  "date": patientDate, 
                  "time": patientTime,
                  "dateEnd": patientDateEnd, 
                  "timeEnd": patientTimeEnd,
                  "notes": patientNotes, 
                  "equipment": patientEquipment,
                  "date+time": patientDate + " " + patientTime,
                  "doctor":userId
             });
             
             // psuhes the refference key to the doctors upcoming branch
             firebase.database().ref('users').child(userId).child("upcoming").push(appointmentkey);
             // pushes the reference key to the patients upcoming branch
             firebase.database().ref('users').child(patientName).child("upcoming").push(appointmentkey);
             
             alert("Appointment Created");
   


         }
    });

}


     
     
/*
    firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            userId = user.uid;
            firebase.database().ref().child("users").child(userId).once("value").then(function(snap){
            var userObj = snap.val(); 
            var patients = userObj.patients;
            var keys = Object.keys(userObj.patients);
            console.log(keys);
                       
             for( var i = 0; i < keys.length; i++) {
                var patientslist = "<option value=" + patients[keys[i]] + ">" + patients[keys[i]] + "</option>";
                    
                     document.getElementById("patientslist").innerHTML += patientslist;
             }
            });
        }

    });
*/