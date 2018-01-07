var mess = document.getElementById("message").value;

$(document).ready(function(){
     $("#amessage").remove(); // removes link to message page from sidemenu
});

function contacts() {
     
     firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // get users id
             userId = user.uid;
             
             firebase.database().ref().child("users").once("value").then(function(snap) {
                  var userList = snap.val();
                 
                 // getting all user ids 
                  var keys = Object.keys(userList);
                  console.log(keys)
                  // for each value(id) find the users name and create an option 
                  keys.forEach( function (value) {
                       //value var is the key to the obj (string)
                       
                       firebase.database().ref().child("users").child(value).once("value").then(function(snap) {
                           // users data
                           var contactObj = snap.val();
                           // find users name
                           var contactName = contactObj.info.name;
                           // create an html option with user name and value of user id
                           var contactlist =  "<option value=" + value + ">" + contactName+ "</option>";    
                           // pushes option to html page
                           document.getElementById("contacts").innerHTML += contactlist;
                       })
                  })
                  })
                  
                  
                  /*
                  
                  PREVIOUS CODE WHICH IS OBSOLET
                  
                  for (var i = 0; i < keys.length; i++) {
                      var contact = keys[i];
                      
                     
                      firebase.database().ref().child("users").child(contact).once("value").then(function(snap) {
                           var contactObj = snap.val();
                           var contactName = contactObj.info.name;
                           var contactlist =  "<option value=" + contact + ">" + contactName+ "</option>";    
                           
                           document.getElementById("contacts").innerHTML += contactlist;
     
                           
                      });
                       

                  } */
          }
     }) 
};  
     
     
     
     
     
     




function message() {
    // finds contacts id from html selection
     var contactName = document.getElementById("contacts").value;
     alert(contactName);
     // if chosen 'patients' alert to choose a user
     if (contactName == "Patients") {
          alert("pick a user");
     } else {
          // clears any existing messages displayed
          document.getElementById("sender").innerHTML = "";
          document.getElementById("senders").innerHTML = "";
          
          
          // creates two input textboxes. title and message
          firebase.database().ref().child("users").child(contactName).once("value").then(function(snap) {
                      var contactObj = snap.val();
                      var contactName = contactObj.info.name;
                      var setup =    
                                        //"<h1 >" + contactName + "</h1>" +
                                       "<input type='text' id='messagetitle' placeholder='Title'/>" +
                                        "<input type='text' id='messagetext' placeholder='Message'/>" +
                                       "<button onclick='send()'>" + 'Send' + "</button>";
                      // pushes the input textboxes for messaging                 
                     document.getElementById("senders").innerHTML += setup ;  
                      
                 });
                
          // finds contact selected to message by user
           var contactid = document.getElementById("contacts").value;
           firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // finds users id
                    userId = user.uid;
                
                // finds all messages sent to the contact selected          
                  firebase.database().ref().child("users").child(userId).child("messages").child(contactid).once("value").then(function(snap) {
                       // all messages between the two users
                       var userdata = snap.val();
                       // all messages the user sent to the contact
                       var userSent = userdata.sent;
                       // all messages the user has received from the contact
                       var userIncoming = userdata.incoming;
                       // empty array to store all messages between the two users
                       var array = [];
                  
                     // if user has only received messages then push all received messages to the array
                    if (userSent == null && userIncoming != null) {
                         var keys2 = Object.keys(userdata.incoming);
                         for (var i = 0; i < keys2.length; i++) {
                                array.push(userIncoming[keys2[i]]);
                            }
                      // if user has only sent messages then push all sent messages to the array        
                      } else if (userSent != null && userIncoming == null) {
                        var keys = Object.keys(userdata.sent);  
                        for (var i = 0; i < keys.length; i++) {
                           array.push(userSent[keys[i]]);
                       }
                      // if user has sent and received messages then push all to the array  
                      } else {
                            var keys = Object.keys(userdata.sent);
                            var keys2 = Object.keys(userdata.incoming);
                            var array = [];
                                           
                            for (var i = 0; i < keys.length; i++) {
                                array.push(userSent[keys[i]]);
                            }
                            
                             for (var i = 0; i < keys2.length; i++) {
                                array.push(userIncoming[keys2[i]]);
                            }    
                      }

                       console.log(array);
                  
                  
                  
                  
                  
                     
                       // take all the messages that are pushed to the new array and sort by date
                       array.sort(function(a,b) { 
                            return new Date(a.time).getTime() - new Date(b.time).getTime() 
                         });

                         
                         console.log(array);
                            
                        // pushes all the messages that are now sorted by date to the html page    
                         for (var i = 0; i < array.length; i++) {
                           var out = "<h3>" + array[i].sender + "</h3>" +
                                     "<p>Title:" + array[i].title + "</p>" +
                                     "<p>Message:" + array[i].message + "</p>" +
                                     "<p>Time:" + array[i].time + "</p>"; 
                           
                           document.getElementById("sender").innerHTML += out;
                       }
                       
                     
                       
                       /*BASIC ONE 
                    if (userSent == null && userIncoming != null) {
                       var keys2 = Object.keys(userdata.incoming);
                      } else if (userSent != null && userIncoming == null) {
                        var keys = Object.keys(userdata.sent);  
                      }
                      
                      
                      
     
                       for (var i = 0; i < keys.length; i++) {
                            console.log(userSent[i]);
                           var out = "<h3>" + 'You' + "</h3>" +
                                     "<p>Title:" + userSent[keys[i]].title + "</p>" +
                                     "<p>Message:" + userSent[keys[i]].message + "</p>" +
                                     "<p>Time:" + userSent[keys[i]].time + "</p>"; 
                           
                           document.getElementById("messenger").innerHTML += out;
                       }
                       
                        for (var i = 0; i < keys2.length; i++) {
                           var incom = "<h3>" + 'Contact' + "</h3>" +
                                       "<p>Title:" + userIncoming[keys2[i]].title + "</p>" +
                                       "<p>Message:" + userIncoming[keys2[i]].message + "</p>" +
                                       "<p>Time:" + userIncoming[keys2[i]].time + "</p>";
                           document.getElementById("messenger").innerHTML += incom;
                       }
                       
                       
                     */  
                
                       
                  }); 
          
     
             
             
        }  
     });  
          
          
          
          
     
     }
     
     
     
}

function send() {
    // text value of message
   var message = document.getElementById("messagetext").value;
   // text value of message title
   var messageTitle = document.getElementById("messagetitle").value;
   // the receiver of message
   var messageReceiver = document.getElementById("contacts").value;
   
        
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // gets user id
             userId = user.uid;  
             
          firebase.database().ref().child("users").child(userId).once("value").then(function(snap) {
             var userList = snap.val();
             // users name
             var userName = userList.info.name;
               
             var d = new Date();
             // gets miliseconds since 1970
             var time = d.getTime();
             var date = new Date(time);
             // converts into standard time
             time = date.toString();
             // pushes message to the users messages banch --> id of the contact branch --> sent branch 
             firebase.database().ref('users').child(userId).child("messages").child(messageReceiver).child("sent").push({
                 "sender": userName, 
                 "title": messageTitle, 
                 "message": message, 
                 "time": time 
                 
             });
             // pushes message to the contacts message branch --> id of users branch --> incoming branch
             firebase.database().ref('users').child(messageReceiver).child("messages").child(userId).child("incoming").push({ 
                 "sender": userName, 
                 "title": messageTitle, 
                 "message": message, 
                 "time": time 
                 
             });
             
             alert("Email Sent");
   
             location.reload();





            })
             
             
            
             
             
             
             
             
             
        }  
     }); 
   
   
   
}



