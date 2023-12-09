// QuoteRunner theme.js

const themeDropdown = document.getElementById("theme-dropdown");
var themeArray = [];
var firstLoadTheme = true;

//Add dropdown options
fetch("https://quoterunner.github.io/themes/themes.json")
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

//Update theme
function updateTheme() {
  fetch("https://quoterunner.github.io/themes/themes.json")
    .then((res) => res.json())
    .then((json) => {
      if (firstLoadTheme == true) {
        if (localStorage.getItem("theme") == undefined) {
          localStorage.setItem("theme", "Default");
          console.info("Theme: Defaults theme set.");
          value = "Default";
        } else {
          value = localStorage.getItem("theme");
        }

        firstLoadTheme = false;
      } else {
        value = themeDropdown.value;
      }

      console.log("Theme: " + value + " activated.");

      localStorage.setItem("theme", value);

      if (themeArray.indexOf(value) == -1) {
        displayError("Theme not found E1");
      } else {
        clearError();
      }
      var json = json[themeArray.indexOf(value)];

      if (json == undefined) {
        displayError("Theme not found E2");
        return;
      } else {
        clearError();
      }

      document.body.style.color = json["textColor"];
      nextColor = json["textColor"];
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

//add dropdown change listener
themeDropdown.addEventListener("change", updateTheme);

//load theme
updateTheme();