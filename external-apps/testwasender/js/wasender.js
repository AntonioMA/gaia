"use strict";


//////////////////////////////////////////////////////////////////////////////
// This exist so I don't have to keep remembering how to do it...
//////////////////////////////////////////////////////////////////////////////
function addText(elem,text) {
    elem.appendChild(document.createTextNode(text));
}

function createElementAt(mainBody,type,id,optionalText,before) {
    var elem=document.createElement(type);
    elem.setAttribute("id",id);
    if (!before) {
        mainBody.appendChild(elem);
    } else {
        mainBody.insertBefore(elem,before);
    }
    if (optionalText) {
        addText(elem,optionalText);
    }
    return elem;
}
//////////////////////////////////////////////////////////////////////////////
// End of useful DOM manipulation...
//////////////////////////////////////////////////////////////////////////////

window.onload=function () {
  var outputElement=document.getElementById("addContent");

  function TestObject() {
  }
  TestObject.prototype = {
    launchActivity: function() {
      var startDate = new Date();
      startDate.setSeconds(0);
      var endDate = new Date();
      endDate.setHours(startDate.getHours() + 3);
      endDate.setSeconds(0);
      var activity = new MozActivity({
        name: "new",
        data: {
          type: "webcalendar/calendarentry",
          calendarEntry: {
            title: "Title 2",
//            isAllDay: false,
            startDate: startDate.toString(),
            endDate: endDate.toString(),
            calendarId: 'offline',
            location: 'A place',
            description: 'A description'
          }
        }
      });
      var self = this;

      activity.onsuccess = (function() {
        var text = "Success! Got an answer!";
        if (!activity.result ||
            !activity.result.success) {
          text = "And once again, I'm missing the data!: " +
                  JSON.stringify(activity.result) + ", " +
                  JSON.stringify(self.result) + " " +
                  JSON.stringify(this.result);

        }

        createElementAt(outputElement, "p", "", text);
      }).bind(this);
    }
  };

  new TestObject().launchActivity();
}
