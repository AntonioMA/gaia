'use strict';

var i = 10;

//////////////////////////////////////////////////////////////////////////////
// This exists only so I don't have to keep remembering how to do it...
//////////////////////////////////////////////////////////////////////////////
  function addText(aElem, aText) {
    aElem.appendChild(document.createTextNode(aText));
  }

  function createElementAt(aMainBody, aType, aAttrs, aOptionalText, aOptionalImg, aBefore) {
    var elem = document.createElement(aType);

    // Add all the requested attributes
    if (aAttrs){
      for (var i in aAttrs){
        elem.setAttribute(i, aAttrs[i]);
      }
    }

    if (!aBefore) {
      aMainBody.appendChild(elem);
    } else {
      mainBody.insertBefore(elem, aBefore);
    }

    if (aOptionalText) {
      addText(elem, aOptionalText);
    }

    return elem;
  }

//////////////////////////////////////////////////////////////////////////////
// End of useful DOM manipulation...
//////////////////////////////////////////////////////////////////////////////

function fib(x) {
  if (x < 2) {
    return x;
  } else {
    return fib(x-1) + fib(x-2);
  }
}
function doSomeCalc(exitContainer) {
  var p1 = createElementAt(exitContainer, "p", undefined, new Date().toString() + ". Calculating fib of " + i);
  var text = new Date().toString() + ": Fib(" + i + ") = " + fib(i++);
  var p = createElementAt(exitContainer, "p", undefined, text);
  if (i > 40) {
    i = 40;
  }
  console.log(text);
}

window.addEventListener('load', function showBody() {
  var exitContainer = document.getElementById("exit_here");
  setInterval(doSomeCalc.bind(undefined, exitContainer), 15000);

});
