// Reading Information 

var userId = "";

$(document).ready(function(){
     firebase.auth().onAuthStateChanged(function(user){
          if (user) {
               userId = user.uid;
               firebase.database().ref("users").once('value').then(function(snap) {
                    var userObj = snap.val()[userId];
                    $("#patientEmail").val(user.email);
                    $("#patientHealth").val(userObj.info.healthcard);
                    $("#patientAddress").val(userObj.info.address);
                    $("#patientNumber").val(userObj.info.phone);
                    $("#patientBirthday").val(userObj.info.birthday);
                    $("#emergencyLastname").val(userObj.info.emergency.lastName);
                    $("#emergencyFirstname").val(userObj.info.emergency.firstName);
                    $("#emergencyPhone1").val(userObj.info.emergency.phone1);
                    $("#emergencyAddress").val(userObj.info.emergency.address);
               });
          }
     });
});

function saveNumber (){
     var patientNumber = $("#patientNumber").val();
     firebase.database().ref("users").child(userId).child("info").child("phone").set(patientNumber);
} 

function saveHealth (){
     var patientHealth = $("#patientHealth").val();
     firebase.database().ref("users").child(userId).child("info").child("healthcard").set(patientHealth);
}

function saveAddress (){
     var patientAddress = $("#patientAddress").val();
     firebase.database().ref("users").child(userId).child("info").child("address").set(patientAddress);
}

function saveBirthday (){
     var patientBirthday = $("#patientBirthday").val();
     firebase.database().ref("users").child(userId).child("info").child("birthday").set(patientBirthday);
}

function saveemergencyFirstname (){
     var emergencyFirstname = $("#emergencyFirstname").val();
     firebase.database().ref("users").child(userId).child("info").child("emergency").child("firstName").set(emergencyFirstname);
}

function saveemergencyLastname (){
     var emergencyLastname = $("#emergencyLastname").val();
     firebase.database().ref("users").child(userId).child("info").child("emergency").child("lastName").set(emergencyLastname);
}

function saveemergencyPhone1 (){
     var emergencyPhone1 = $("#emergencyPhone1").val();
     firebase.database().ref("users").child(userId).child("info").child("emergency").child("phone1").set(emergencyPhone1);
}

function saveemergencyAddress (){
     var emergencyAddress = $("#emergencyAddress").val();
     firebase.database().ref("users").child(userId).child("info").child("emergency").child("address").set(emergencyAddress);
}