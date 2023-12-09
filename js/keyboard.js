// QuoteRunner keyboard.js


const keyboardDropdown = document.getElementById("keyboard-dropdown");
var keyboardArray = [];
var firstLoadKeyboard = true;

//add dropdown options
fetch("https://quoterunner.github.io/keyboard/keyboards.json")
  .then((res) => res.json())
  .then((json) => {
    var currentKeyboard = 0;

    while (currentKeyboard < Object.keys(json).length) {
      var name = json[currentKeyboard]["name"];
      keyboardArray.push(name);

      keyboardDropdown.innerHTML +=
        "<option value='" + name + "' id='" + name + "'>" + name + "</option>";
      currentKeyboard++;
    }
  });

//Update keyboard
function updateKeyboard() {
  fetch("https://quoterunner.github.io/keyboard/keyboards.json")
    .then((res) => res.json())
    .then((json) => {
      if (firstLoadKeyboard == true) {
        if (localStorage.getItem("keyboard") == undefined) {
          localStorage.setItem("keyboard", "QWERTY");
          console.info("Keyboard: Default layout set.");
          value = "QWERTY";
        } else {
          value = localStorage.getItem("keyboard");
        }

        firstLoadKeyboard = false;
      } else {
        value = keyboardDropdown.value;
      }

      console.log("Keyboard: " + value + " layout set.");

      localStorage.setItem("keyboard", value);

      if (keyboardArray.indexOf(value) == -1) {
        displayError("Keyboard not found");
      } else {
        clearError();
      }
      var json = json[keyboardArray.indexOf(value)];

      document.getElementById("keyboard").innerHTML = json["html"];

      document.getElementById(value).setAttribute("selected", "selected");
    });
}

//add dropdown change listener
keyboardDropdown.addEventListener("change", updateKeyboard);

//load keyboard
updateKeyboard();