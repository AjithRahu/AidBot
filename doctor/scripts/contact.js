var userId = "";

$(document).ready(function() {
     $("#acontact").remove();
     
     firebase.auth().onAuthStateChanged(function(user){
          if (user) {
               userId = user.uid;
               firebase.database().ref().child("users").once('value').then(function(snap) {
                    var userObj = snap.val()[userId];
                    var hospitalId = userObj.info.hospital;
                    var hospital = snap.val()[hospitalId].info;
                    var address = hospital.address;
                    var name = hospital.name;
                    var phone = hospital.phone;
                    var hospitalInfo = "<h3>" + name + "</h3>" + "<p>Address: " + address + "</p> <p>Phone: " + phone + "</p>";
                    $("#hospitals").html(hospitalInfo);
               });
          }
     });
});