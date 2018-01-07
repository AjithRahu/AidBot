var userId = "";
$(document).ready(function() {
     $("#aprescription").remove();
     
     $("#viewBut").click(function(){
          $("#create").css("display","none");
          $("#view").css("display", "block");
     });
     
     $("#createBut").click(function(){
          $("#create").css("display","block");
          $("#view").css("display", "none");
     });
     
     firebase.auth().onAuthStateChanged(function(user){
          if (user) {
               userId = user.uid;
               firebase.database().ref().child("users").once('value').then(function(snap) {
                    var userObj = snap.val()[userId];
                    var patientObj = userObj.patients;
                    var patientKeys = Object.keys(patientObj)
                    var patients = [];
                    for (var i = 0; i < patientKeys.length; i++) {
                        patients.push(patientObj[patientKeys[i]]);
                    }
                    var users = snap.val();
                    for (var i = 0; i < patients.length; i++) {
                        var patientId = patients[i];
                        var name = users[patientId].info.name;
                        $("#prescriptionPatient").append("<option value=" + patientId + ">"+ name +"</option>");
                    }
               });
                    firebase.database().ref().child("users").child(userId).child("prescriptions").on("value", function(snap){
                         viewPrescriptions();  
                    });
          }
     });
     
});


function createPrescription() {
     var prescriptionPatient = document.getElementById("prescriptionPatient").value;
     if (prescriptionPatient != "") {
          var prescriptionName = document.getElementById("prescriptionName").value;
          var prescriptionDate = document.getElementById("prescriptionDate").value;
          var prescriptionQuantity = document.getElementById("prescriptionQuantity").value;
          var prescriptionRefill = document.getElementById("prescriptionRefill").value;
          
          var patientId = document.getElementById("prescriptionPatient").value;
          
          
           
          var prescription = {
                     "prescription": prescriptionName,
                       "patient": prescriptionPatient, 
                       "date": prescriptionDate, 
                       "quantity": prescriptionQuantity,
                       "refill": prescriptionRefill, 
                  }
           
          var key = firebase.database().ref().child("prescriptions").push(prescription).key;
          firebase.database().ref().child("prescriptions").child(key).set(prescription);
          firebase.database().ref().child("users").child(userId).child("prescriptions").push(key);
          firebase.database().ref().child("users").child(patientId).child("prescriptions").push(key);
                  
          alert("Prescription Created");
          location.reload();
     }
     
     else { 
          alert("Select a patient");
     }
}

function viewPrescriptions() {
     $("#prescriptions").html("");
     firebase.database().ref().once("value").then(function(snap){
          var database = snap.val();
          var users = database.users;
          var prescriptionsObj = database.prescriptions;
          var userPrescriptions = database.users[userId].prescriptions;
          var prescriptionsKeys = Object.keys(userPrescriptions);
          var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          for (var i = 0; i < prescriptionsKeys.length; i++) {
               var prescriptionObjKey = prescriptionsKeys[i];
               var key = userPrescriptions[prescriptionObjKey];
               var prescription = prescriptionsObj[key];
               var date = prescription.date.split("-");
               var patient = users[prescription.patient].info.name;
               var dayNum = new Date(date[0], date[1], date[2]).getDay();
               $("#prescriptions").append(
                    "Date issued: " + days[dayNum] + ", " + months[date[1]-1] + " " + date[2] + ", " + date[0] + "<br>" +
                    "Patient: " + patient + "<br>" +
                    "Drug: " + prescription.prescription +  "<br>" +
                    "Quantity: " + prescription.quantity + "<br>" +
                    "Refills: " + prescription.refill +
                    "<br><br>"
               );
          }
          
     });
}