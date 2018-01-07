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

$(document).ready(function() {

        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var account = $("#account").val();
            var name = $("#name").val();
            var birthday = $("#birthday").val();
            var healthcard = $("#healthcard").val();
            var hospital = $("#selectH").val();
            var doctor = $("#selectD").val();
            var address = $("#address").val();
            var uid = user.uid;
            if (account == "hospital") {
                firebase.database().ref().child("users").child(uid).set({
                    "type":"hospital",
                    "info": {
                        "address":address,
                        "name":name,
                        "phone":""
                    },
                    "doctors":"",
                    "equipment":"",
                });
                window.location = "../hospital/settings.html";
            }
            else if (account == "doctor") {
                firebase.database().ref().child("users").child(uid).set({
                    "type":"doctor",
                    "info": {
                        "birthday":birthday,
                        "hospital":hospital,
                        "name":name,
                        "phone":""
                    },
                    "patients":"",
                    "schedule":"",
                    "upcoming":"",
                    "notifications":"",
                    "prescriptions":"",
                    
                });
                firebase.database().ref().child("users").child(hospital).child("doctors").push(uid);
                window.location = "../doctor/settings.html";
            }
            else if (account == "patient") {
                firebase.database().ref().child("users").child(uid).set({
                    "type":"patient",
                    "info": {
                        "address":address,
                        "birthday":birthday,
                        "emergency":{
                            "firstName": "",
                            "lastName" : "",
                            "phone1": "",
                            "phone2": "",
                            "address": "",
                            "postal": ""
                        },
                        "healthcard":healthcard,
                        "hospital":hospital,
                        "name":name,
                        "phone":""
                    },
                    "patients":"",
                    "schedule":"",
                    "upcoming":"",
                    "notifications":"",
                    "prescriptions":"",
                });
                firebase.database().ref().child("users").child(doctor).child("patients").push(uid);
                firebase.database().ref().child("users").child(uid).child("info").child("doctor").push(doctor);
                firebase.database().ref().child("users").child(uid).child("info").child("hospital").push(hospital);
                window.location = "../patient/settings.html";
            }
            alert("account created");
        }
    });
});

function displayAccount() {
    if ($("#account").val() == "hospital") {
        $("#selectpH").css("display", "none");
        $("#selectH").css("display", "none");
        $("#selectpD").css("display", "none");
        $("#selectD").css("display", "none");
        $("#address").css("display", "block");
        $("#addressp").css("display", "block");
        $("#birthday").css("display", "none");
        $("#birthdayp").css("display", "none");
        $("#healthcard").css("display", "none");
        $("#healthcardp").css("display", "none");
    }
    else if ($("#account").val() == "doctor") {
        $("#selectpH").css("display", "block");
        $("#selectH").css("display", "block");
        $("#selectpD").css("display", "none");
        $("#selectD").css("display", "none");
        $("#address").css("display", "none");
        $("#addressp").css("display", "none");
        $("#birthday").css("display", "block");
        $("#birthdayp").css("display", "block");
        $("#healthcard").css("display", "none");
        $("#healthcardp").css("display", "none");
        $("#selectH").html("<option selected disabled>Select a Hospital</option>");
        firebase.database().ref().child("users").once("value").then(function(snap) {
            var users = snap.val();
            var ids = Object.keys(users);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var user = users[id];
                if (user.type == "hospital") {
                    $("#selectH").append("<option value=" + id +">" + user.info.name + "</option>");
                }
            }
        });
    }
    else {
        $("#selectpH").css("display", "block");
        $("#selectH").css("display", "block");
        $("#selectpD").css("display", "none");
        $("#selectD").css("display", "none");
        $("#address").css("display", "none");
        $("#addressp").css("display", "none");
        $("#birthday").css("display", "block");
        $("#birthdayp").css("display", "block");
        $("#healthcard").css("display", "block");
        $("#healthcardp").css("display", "block");
        $("#selectH").html("<option selected disabled>Select a Hospital</option>");
        firebase.database().ref().child("users").once("value").then(function(snap) {
            var users = snap.val();
            var ids = Object.keys(users);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var user = users[id];
                if (user.type == "hospital") {
                    $("#selectH").append("<option value=" + id +">" + user.info.name + "</option>");
                }
            }
        });
    }
}

function displayDoctor() {
    if ($("#account").val() == "patient") {
        $("#selectpD").css("display", "block");
        $("#selectD").css("display", "block");
        $("#selectD").html("<option selected disabled>Select a Doctor</option>");
        firebase.database().ref().child("users").once("value").then(function(snap) {
            var users = snap.val();
            var hospitalid = $("#selectH").val();
            var hospital = users[hospitalid];
            var doctorkeys = Object.keys(hospital.doctors);
            for (var i = 0; i < doctorkeys.length; i++) {
                var id = hospital.doctors[doctorkeys[i]];
                var user = users[id];
                $("#selectD").append("<option value=" + id +">" + user.info.name + "</option>");
            }
        });
    }
}

function signup() {
    var account = $("#account").val();
    var name = $("#name").val();
    var email = $("#e-mail").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
    var birthday = $("#birthday").val();
    var healthcard = $("#healthcard").val();
    var hospital = $("#selectH").val();
    var doctor = $("#selectD").val();
    var address = $("#address").val();
    
    if (account != "" && name != "" && email != ""  && password !="" && password2 !="") {
        if (password == password2) {
            if (account == "hospital" && address != "") {
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    if (error) {
                        alert(error.message);
                    }
                });
            }
            else if (account == "doctor" && hospital != null && birthday != "") {
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    if (error) {
                        alert(error.message);
                    }
                });
            }
            else if (account == "patient" && hospital != null && doctor != null && birthday != "" && healthcard != "") {
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    if (error) {
                        alert(error.message);
                    }
                });
            }
            else {
                alert("Please Fill All Fields");
            }
        } else {
            alert("passwords do not match");
        }
    }
    else {
        alert("Please Fill All Fields");
    }
}