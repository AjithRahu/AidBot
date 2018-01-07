var x = 0; // 0 is the current month adding or decreasing changes the month
var upcoming = []; // holds dates and keys for upcoming appointments
var upcomingObj = ""; // holds all upcoming appointments
var appointmentsMonth = []; // holds appointments by cell in calendar
for (var i = 0; i < 36; i++) {
     appointmentsMonth.push([]); // makes an array with an array for each cell in the calendar table
}
var users = ""; // will hold all users from firebase

$(document).ready(function() {
     $("#acalendar").remove(); // removes link to calendar page from sidemenu
     $("#left").click(function(){ // when left arrow is clicked, the month is decremented and calendary is displayed again
          x--;
          getCalendar();
     });
     $("#right").click(function(){ // when left arrow is clicked, the month is decremented and calendary is displayed again
          x++;
          getCalendar();
     });
     $("#monthyear").click(function() { // clicking the month returns the user to the current month
          x = 0;
          getCalendar();
     });
     for (var i = 0; i < 25; i++) { // loop makes day schedule
          var time = i;
          var top = i * 60 - 9;
          if (time == 0) { // time is 12am if it is 0
               time = "12am";
          }
          else if (time < 13) { // adds "am" if time is less than 13
               time += "am";
          }
          else if (time < 24) { // adds "pm" if time is less than 24 and makes the time a 12 hour format
               time = i - 12;
               time += "pm";
          }
          else {
               time = "12am"; // makes time "12am"
          }
          $("#time").append("<div class='time' style='top:" + top + "px'>" + time + "</div>");
          // add a div with the time of day for the day preview
     }
     firebase.database().ref().once("value").then(function(snap) { // gets entire database and makes snap the object holding it
          upcomingObj = snap.val().appointments; // holds all appointments
          users = snap.val().users; // holds all user information
          var userUpcoming = snap.val().users[uid].upcoming; // gets upcomingObj keys for appointments involving current user, uid is a variable from sidemenu.js, it holds the current user's unique id
          var keys = Object.keys(userUpcoming); // gets keys for userUpcoming object so that the userUpcoming object can be looped through
          for (var i = 0; i < keys.length; i++) {
               var key = userUpcoming[keys[i]]; // gets a key for the upcoming object from userUpcoming by looping through an array of keys of the objects
               upcoming.push({"date":upcomingObj[key].date, "key":key}); // holds date and key of appointments relevant to user
               upcoming[i].date = upcoming[i].date.split("-"); // splits date so it goes from "2017-12-18", ["2017", "12", "18"]
               upcoming[i].date[1]--; // month needs to be decremented because javascript months go from 0-11 but it was saved from 1-12
          }
          getCalendar();
     });
});

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// holds months

function getCalendar() {
     // clears day preview
     $("#preview").html(""); 
     $("#daypreview").html("");
     $("#dayView").css("display","none");
     
     // creates first row to hold day of the week
     $("#calendar").html("<tr>" +
                    "<th>S</th>" +
                    "<th>M</th>" +
                    "<th>T</th>" +
                    "<th>W</th>" +
                    "<th>T</th>" +
                    "<th>F</th>" +
                    "<th>S</th>" +
     "</tr>");
     
     var y = 0; // holds number of cell
     for (var i = 1; i < 7; i++) {
          $("#calendar").append("<tr></tr>");
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++; // increments cell number so each cell can hold a unique number
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
     }
     
     var now = new Date();
     var selectedMonth = new Date(now.getFullYear(), now.getMonth() + x, 1);
     // date is relevant to current month, the month is decreased or increased based on how many times the left or right arrow was pressed
     
     var day = selectedMonth.getDay(); // gets day of week of the first day of the months
     var month = selectedMonth.getMonth(); // gets month
     $("#monthyear").html(months[month] + " " + selectedMonth.getFullYear()); // displays current month and year
     
     // getting date for next month but entering 0 as the day returns the last day of the current month
     var days = new Date(selectedMonth.getFullYear(), month + 1, 0).getDate();
     var calendar = document.getElementById("calendar");
     var rowNum = 1; // starts row at 1 becuase 0 is the days of the week
     
     var appointments = []; // holds appointments for current month
     for (var i = 0; i < upcoming.length; i++) { // loops through user's appointments
          if (upcoming[i].date[0] == selectedMonth.getFullYear() && upcoming[i].date[1] == selectedMonth.getMonth()) { 
               // if selected month and year match the month and year of appointment, then they are pushed to the appointments array
               appointments.push(upcoming[i]);
          }
     }
     
     for (var i = 1; i <= days; i++) { // loops from 1 to the number of days in the month
          calendar.rows[rowNum].cells[day].innerHTML = i; // has cell display the date
          for (var ii = 0; ii < appointments.length; ii++) {
               if (appointments[ii].date[2] == i) {
                    var dayCell = (rowNum - 1) * 7 + day;
                    var cell = calendar.rows[rowNum].cells[day];
                    cell.className = "busy";
                    appointmentsMonth[dayCell].push(appointments[ii]);
               }
          }
          
          day++;
          if (day > 6) {
               rowNum++;
               day = 0;
          }
     }
}

function viewDay(dayIndex) {
     $(".busy").css("box-shadow", "none").css("background-color", "white").css("color", "#5e9cd3");
     $("#preview").html("");
     $("#daypreview").html("");
     $("#dayView").css("display","none");
     var appointments = appointmentsMonth[dayIndex];
     if (appointments.length != 0) {
          $("#dayView").css("display","block");
          var rowNum = Math.floor(dayIndex/7) + 1;
          var cell = dayIndex % 7;
          var cellRef = document.getElementById("calendar").rows[rowNum].cells[cell];
          cellRef.style.backgroundColor = "#5e9cd3";
          cellRef.style.color = "white";
          cellRef.style.boxShadow = "0 0 0 2px white";
          $("#preview").html("<h3>Appointments</h3>");
          var startTimes = [];
          for (var i = 0; i < appointments.length; i++) {
               var appointment = upcomingObj[appointments[i].key];
               var startTime = appointment.time.split(":");
               var endTime = appointment.timeEnd.split(":");
               var start = startTime[0] * 60 + parseInt(startTime[1]);
               startTimes.push(start);
               var end = endTime[0] * 60 + parseInt(endTime[1]);
               if (end < start) {
                    end += 24*60;
               }
               var height = (end - start);
               var startTop = start;
               $("#daypreview").append("<div class='daypreviewapp' style='top:" + startTop + "px;height:" + height + "px;' onclick=viewAppointment('" + appointments[i].key + "')></div>");
          }
          var scroll = Math.min.apply(null, startTimes);
          var offset = $("#dayView").offset().top;
          $("html, body").animate({scrollTop: offset}, "slow");
          $("#dayView").scroll().animate({scrollTop: scroll - 30}, "slow");
     }
}

function viewAppointment(appointmentIndex) {
     var appointment = upcomingObj[appointmentIndex];
     var patient = users[appointment.patient];
     $("#modal").css("display", "block");
     $('body').css('top', -(document.documentElement.scrollTop) + 'px').css("position", "fixed").css("overflow-y", "scroll");
     var date = appointment.date.split("-");
     date[1]--;
     var dayNum = new Date(date[0], date[1], date[2]).getDay();
     var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     var dateStr = days[dayNum] + ", " + months[date[1]] + " " + date[2] + ", " + date[0];
     $("#appointment").html("<h2>" + dateStr + "</h2>" +
          "Patient: " + patient.info.name +
          "<br>Time: " + timeStr(appointment.time.split(":")) + " - " + timeStr(appointment.timeEnd.split(":")) + 
          "<br> Equipment: " + appointment.equipment +
          "<br> Additional Notes: " + appointment.notes
     );
     $(".start").html(appointment.date + " " + timeStr(appointment.time.split(":")));
     $(".end").html(appointment.dateEnd + " " + timeStr(appointment.timeEnd.split(":")));
     $(".description").html(appointment.notes);
}

function closeModal() {
     $("#appointment").html("");
     $('body').css('top', -(document.documentElement.scrollTop) + 'px').css("position", "").css("overflow-y", "");
     $("#modal").css("display", "none");
     var offset = $("#dayView").offset().top;
     $("html, body").scrollTop(offset);
}

function timeStr(time) {
     if (time[0] < 12) {
          time[2] = " AM";
     }
     else {
          time[2] = " PM";
     }
     if (time[0] > 12) {
          time[0] -= 12;
     }
     else if(time[0] == 0) {
          time[0] = 12;
     }
     return time[0] + ":" + time[1] + time[2];
}