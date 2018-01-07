
// Reading Doctor Information

var userId = "";

$(document).ready(function(){
     $("#asettings").remove();
     
     firebase.auth().onAuthStateChanged(function(user){
          if (user) {
               userId = user.uid;
               firebase.database().ref("users").once('value').then(function(snap) {
                    var userObj = snap.val()[userId];
                    $("#doctorEmail").val(user.email);
                    var hospitalId = userObj.info.hospital;
                    $("#doctorHospitals").val(snap.val()[hospitalId].info.name);
                    $("#doctorNumber").val(userObj.info.phone);
               });
          }
     });
});
     
function saveemergencyAddress (){
     var emergencyAddress = $("#emergencyAddress").val();
     firebase.database().ref("users").child(userId).child("info").child("emergency").child("address").set(emergencyAddress);
}