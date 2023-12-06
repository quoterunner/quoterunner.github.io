// QuoteRunner script.js

// /-----------\
// | Variables |
// \-----------/

//html elements
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");

//for timer function
var seconds = 0;
var quoteLength = 0;
var timerRunning = false;

//for the keypress event function
var currentLetterKeypress = 0;
var correctLetters = 0;
var firstLetter = true;

//for the onload
var minLength = localStorage.getItem("minLength");
var maxLength = localStorage.getItem("maxLength");
var lengthName = localStorage.getItem("lengthName");

//for getQuote function
var smallSize = document.getElementById("small");
var mediumSize = document.getElementById("medium");
var largeSize = document.getElementById("large");
var saveYourSoulSize = document.getElementById("save-your-soul");

//for themes
var headerQuoteUnselected;
var headerQuoteSelected;
var quoteColor;
var authorColor;
var cursorColor;

//for the keyboard
const allowedLetters = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "space",
];

// /-----------\
// | Functions |
// \-----------/

//custom error popup
function displayError(icon, text) {
  document.getElementById("local-error-trigger").innerHTML =
    '<div id="local-error-container"> <div id="local-error"> <span class="material-symbols-rounded" style="font-size: 50px;"> ' +
    icon +
    " </span> <h2> " +
    text +
    " </h2> </div> </div>";
}
function clearError() {
  document.getElementById("local-error-trigger").innerHTML = "";
}

//timer for wpm
function timer() {
  if (timerRunning) {
    seconds++;
    setTimeout(timer, 1000);
  }
}

//get a new quote
function getQuote(minLength, maxLength, lengthName) {
  firstLetter = true;
  currentLetterKeypress = 0;
  correctLetters = 0;

  if (
    minLength == undefined ||
    maxLength == undefined ||
    lengthName == undefined
  ) {
    var minLength = localStorage.getItem("minLength");
    var maxLength = localStorage.getItem("maxLength");
    var lengthName = localStorage.getItem("lengthName");
  }

  localStorage.setItem("minLength", minLength);
  localStorage.setItem("maxLength", maxLength);
  localStorage.setItem("lengthName", lengthName);

  smallSize.style.color = headerQuoteUnselected;
  mediumSize.style.color = headerQuoteUnselected;
  largeSize.style.color = headerQuoteUnselected;
  saveYourSoulSize.style.color = headerQuoteUnselected;

  document.getElementById(lengthName).style.color = headerQuoteSelected;

  // quote api from https://github.com/lukePeavey/quotable
  fetch(
    "https://api.quotable.io/quotes/random?minLength=" +
      minLength +
      "&maxLength=" +
      maxLength
  )
    .then((res) => res.json())
    .then((json) => {
      var json = json[0];
      var quote = json["content"].split("");
      var author = "-" + json["author"];

      console.info("New quote: " + json["content"] + " " + author);

      quoteElement.innerHTML = "";
      quoteLength = json["length"];

      var currentQuoteIndex = 0;
      while (currentQuoteIndex < quoteLength) {
        var character = quote[currentQuoteIndex];
        if (character == " ") {
          character = "&nbsp;";
        }

        var h1 = document.createElement("h1");
        h1.innerHTML = character;
        h1.id = currentQuoteIndex;
        quoteElement.appendChild(h1);

        currentQuoteIndex++;
      }
      authorElement.innerHTML = author;
    })
}

function keypressEvent(event) {
  var key = event.key;

  if (key == "Enter" || key == "Tab") {
    getQuote();
    return;
  } else if (key == "Shift"){
    return;
  }

  if (firstLetter == true) {
    firstLetter = false;
    seconds = 0;
    timerRunning = true;
    timer();
  }

  var currentLetter = document.getElementById(currentLetterKeypress);
  if (key == " ") {
    key = "&nbsp;";
  }

  if (currentLetter == null) {
    return;
  } else {
    if (currentLetter.innerHTML == "…") {
      if (key == ".") {
        key = "…";
      }
    }

    if (key == currentLetter.innerHTML) {
      currentLetter.style.color = "green";
      currentLetter.style.borderLeft = "";
      currentLetterKeypress++;
      correctLetters++;

      currentLetter = document.getElementById(currentLetterKeypress);
      if (currentLetter == null) {
        timerRunning = false;
        var accuracy = Math.round((correctLetters / quoteLength) * 100);
        var rawWpm = Math.round(quoteLength / 5 / (seconds / 60));
        var wpm = Math.round(rawWpm * (accuracy / 100));

        console.log("Quote stats: ");
        console.info("Quote length: " + quoteLength);
        console.info("Correct letters: " + correctLetters);
        console.info("Seconds to complete: " + seconds);
        console.info("Raw WPM: " + rawWpm);
        console.info("Accuracy: " + accuracy);
        console.info("WPM: " + wpm);

        document.getElementById("quote").innerHTML =
          "<div id='results'><h1>" +
          wpm +
          "</h1><p>WPM</p></div><div id='results'><h1>" +
          accuracy +
          "%</h1><p>Accuracy</p></div><div id='results'><h1>" +
          rawWpm +
          "</h1><p>Raw WPM</p></div><div id='results'><h1>" +
          seconds +
          "</h1><p>Seconds</p></div><div id='results'><img src='next.svg' onclick='getQuote();'></div>";

        firstLetter = true;
        currentLetterKeypress = 0;
        correctLetters = 0;
      } else {
        currentLetter.style.borderLeft = "3px solid " + cursorColor;
        if (!document.getElementById(currentLetterKeypress + 10) == null) {
          document
            .getElementById(currentLetterKeypress + 10)
            .scrollIntoView(true);
        }

        return true;
      }
    } else {
      currentLetter.style.borderLeft = "3px solid red";
      correctLetters--;

      return false;
    }
  }
}

// /-----------------\
// | Event listeners |
// \-----------------/

//caps lock and keyboard
document.addEventListener("keydown", (e) => {
  var caps = e.getModifierState("CapsLock");
  if (caps) {
    displayError("keyboard_capslock", "Caps lock on");
  } else {
    clearError();
  }

  var correctLetter = keypressEvent(e);

  var key = e.key.toLowerCase();

  if (key == " ") {
    key = "space";
  }

  if (allowedLetters.includes(key)) {
    var keyboardKey = document.getElementById("key-" + key);
    if (correctLetter) {
      keyboardKey.style.backgroundColor = "green";
    } else if (!correctLetter) {
      keyboardKey.style.backgroundColor = "red";
    }
  }
});

//keyboard
document.addEventListener("keyup", (e) => {
  var key = e.key.toLowerCase();

  if (key == " ") {
    key = "space";
  }

  if (allowedLetters.includes(key)) {
    var keyboardKey = document.getElementById("key-" + key);
    keyboardKey.style.backgroundColor = "grey";
  }
});

if (
  minLength == undefined ||
  maxLength == undefined ||
  lengthName == undefined
) {
  minLength = 0;
  maxLength = 50;
  lengthName = "small";
}

getQuote(minLength, maxLength, lengthName);

fetch("https://raw.githubusercontent.com/quoterunner/themes/main/themes.json")
  .then((res) => res.json())
  .then((json) => {
    var currentTheme = 0;

    while (currentTheme < Object.keys(json).length) {
      var name = json[currentTheme]["name"];
      themeArray.push(name);

      themeDropdown.innerHTML +=
        "<option value='" + name + "' id='" + name + "'>" + name + "</option>";
      currentTheme++;
    }
  });

const themeDropdown = document.getElementById("theme-dropdown");
var themeArray = [];

const header = document.getElementById("header");

var firstLoad = true;

function updateTheme() {
  fetch("https://raw.githubusercontent.com/quoterunner/themes/main/themes.json")
    .then((res) => res.json())
    .then((json) => {
      if (firstLoad == true) {
        if (localStorage.getItem("theme") == undefined) {
          localStorage.setItem("theme", "Default");
          console.info("Theme: Defaults theme set.");
        } else {
          value = localStorage.getItem("theme");
        }
    
        firstLoad = false;
      } else {
        value = themeDropdown.value;
      }
    
      console.log("Theme: " + value + " activated.");
    
      localStorage.setItem("theme", value);

      if (themeArray.indexOf(value) == -1) {
        displayError("palette", "Error: Theme not found");
      } else {
        clearError();
      }
      var json = json[themeArray.indexOf(value)];

      document.body.style.color = json["textColor"];
      cursorColor = json["cursorColor"];
      document.body.style.backgroundColor = json["backgroundColor"];
      header.style.backgroundColor = json["headerBackgroundColor"];
      header.style.color = json["headerTextColor"];
      headerQuoteUnselected = json["headerQuoteUnselected"];
      headerQuoteSelected = json["headerQuoteSelected"];
      quoteColor = json["quoteColor"];
      authorColor = json["authorColor"];

      document.getElementById(value).setAttribute("selected", "selected");

      getQuote();
    });
}

themeDropdown.addEventListener("change", updateTheme);

updateTheme();
