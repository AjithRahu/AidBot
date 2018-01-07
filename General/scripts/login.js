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
            console.log("logged in");
            var uid = user.uid;
            firebase.database().ref().child("users").child(uid).once("value").then(function(snap){
                var type = snap.val().type;
                if (type == "doctor") {
                    window.location = "../doctor/settings.html";
                }
                else if (type == "hospital") {
                    window.location = "../hospital/settings.html";
                }
                else {
                    window.location = "../patient/settings.html";
                }
            })
        }
    });
});

function login() {
    var email = $("#email").val();
    var password = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}