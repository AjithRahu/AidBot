// Reading Information

var userId = "";

$(document).ready(function(){
     firebase.auth().onAuthStateChanged(function(user){
          if (user) {
               userId = user.uid;
               firebase.database().ref("users").once('value').then(function(snap) {
                    var userObj = snap.val()[userId];
                    $("#hospitalName").val(userObj.info.name);
                    $("#hospitalAddress").val(userObj.info.address);
                    $("#hospitalEmail").val(user.email);
                    $("#hospitalNumber").val(userObj.info.phone);
               });
          }
     });
});
     
function savehospitalName (){
     var hospitalName = $("#hospitalName").val();
     firebase.database().ref("users").child(userId).child("info").child("name").set(hospitalName);
}

function savehospitalAddress (){
     var hospitalAddress = $("#hospitalAddress").val();
     firebase.database().ref("users").child(userId).child("info").child("address").set(hospitalAddress);
}

function savehospitalNumber (){
     var hospitalNumber = $("#hospitalNumber").val();
     firebase.database().ref("users").child(userId).child("info").child("phone").set(hospitalNumber);
}