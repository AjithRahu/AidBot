var x = 0;
var upcoming = [];
var upcomingObj = "";
var appointmentsMonth = [];
for (var i = 0; i < 36; i++) {
     appointmentsMonth.push([]);
}
var users = "";

$(document).ready(function() {
     $("#acalendar").remove();
     $("#left").click(function(){
          x--;
          getCalendar();
     });
     $("#right").click(function(){
          x++;
          getCalendar();
     });
     $("#monthyear").click(function() {
          x = 0;
          getCalendar();
     });
     for (var i = 0; i < 25; i++) {
          var time = i;
          var top = i * 60 - 9;
          if (time == 0) {
               time = "12am";
          }
          else if (time < 13) {
               time += "am";
          }
          else if (time < 24) {
               time = i - 12;
               time += "pm";
          }
          else {
               time = "12am";
          }
          $("#time").append("<div class='time' style='top:" + top + "px'>" + time + "</div>");
     }
     firebase.database().ref().on("value", function(snap) {
          upcomingObj = snap.val().appointments;
          users = snap.val().users;
          var userUpcoming = snap.val().users[uid].upcoming;
          var keys = Object.keys(userUpcoming);
          for (var i = 0; i < keys.length; i++) {
               var key = userUpcoming[keys[i]];
               upcoming.push({"date":upcomingObj[key].date, "key":key});
               upcoming[i].date = upcoming[i].date.split("-");
               upcoming[i].date[1]--;
          }
          getCalendar();
     });
});

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCalendar() {
     $("#preview").html("");
     $("#calendar").html("<tr>" +
                    "<th>S</th>" +
                    "<th>M</th>" +
                    "<th>T</th>" +
                    "<th>W</th>" +
                    "<th>T</th>" +
                    "<th>F</th>" +
                    "<th>S</th>" +
      "</tr>");
     var y = 0;
     for (var i = 1; i < 7; i++) {
          $("#calendar").append("<tr></tr>");
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
          document.getElementById("calendar").rows[i].innerHTML += "<td onclick='viewDay(" + y + ")'></td>";
          y++;
     }
     
     var now = new Date();
     var selectedMonth = new Date(now.getFullYear(), now.getMonth() + x, 1);
     var day = selectedMonth.getDay();
     var month = selectedMonth.getMonth();
     $("#monthyear").html(months[month] + " " + selectedMonth.getFullYear());
     var days = daysInMonth(month + 1, selectedMonth.getFullYear());
     var calendar = document.getElementById("calendar");
     var rowNum = 1;
     
     var appointments = [];
     for (var i = 0; i < upcoming.length; i++) {
          if (upcoming[i].date[0] == selectedMonth.getFullYear() && upcoming[i].date[1] == selectedMonth.getMonth()) {
               appointments.push(upcoming[i]);
          }
     }
     
     for (var i = 1; i <= days; i++) {
          calendar.rows[rowNum].cells[day].innerHTML = i;
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

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
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
     var doctor = users[appointment.doctor];
     $("#modal").css("display", "block");
     $('body').css('top', -(document.documentElement.scrollTop) + 'px').css("position", "fixed").css("overflow-y", "scroll");
     var date = appointment.date.split("-");
     date[1]--;
     var dayNum = new Date(date[0], date[1], date[2]).getDay();
     var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     var dateStr = days[dayNum] + ", " + months[date[1]] + " " + date[2] + ", " + date[0];
     $("#appointment").html("<h2>" + dateStr + "</h2>" +
          "Doctor: " + doctor.info.name +
          "<br>Time: " + timeStr(appointment.time.split(":")) + " - " + timeStr(appointment.timeEnd.split(":")) + 
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