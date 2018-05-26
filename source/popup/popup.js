document.addEventListener('DOMContentLoaded', function() {

  console.log("ecoify popup opened");

  // background page
  var bgPage = chrome.extension.getBackgroundPage();

  // toggle
  var toggle = document.getElementById('toggle');
  bgPage.readToggle().then((new_toggle) => {
    toggle.checked = new_toggle;
    updateToggle(toggle.checked);
  });
  toggle.addEventListener('click', function () {
    bgPage.setToggle(toggle.checked);
    updateToggle(toggle.checked);
  });

  var settings = document.getElementById('settings');
  settings.onclick = function () {
    var x = document.getElementById("editor");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function saveSettings() {
    const content = document.getElementById('editor_content').value
    console.log(content)
  }

  document.getElementById('save_editor').addEventListener("submit", function (e) {
    console.log("Hallol");
    if (!isValid) {
      e.preventDefault();    //stop form from submitting
    };
  }, false)

  // update carbon grams counter
  var carbon_grams = document.getElementById('carbon_grams');
  bgPage.readCounter().then((counter) => {
    console.log("read counter: ", counter);
    new_carbon_grams = counter * 0.2;
    var new_carbon_grams_text;

    if (new_carbon_grams < 1000) {
      new_carbon_grams_text = parseFloat((new_carbon_grams).toFixed(4)) + " g";
    } else if (new_carbon_grams < 1000000) {
      new_carbon_grams_text = parseFloat((new_carbon_grams / 1000).toFixed(4)) + " kg";
    } else {
      new_carbon_grams_text = parseFloat((new_carbon_grams / 1000000).toFixed(4)) + " t";
    }

    carbon_grams.innerHTML = new_carbon_grams_text;
  });

}, false);


function updateToggle(toggle) {
  var body = document.getElementsByTagName("BODY")[0];
  var bgPage = chrome.extension.getBackgroundPage();
  if (toggle) {
    // listener
    bgPage.addReqListener();
    // popup background
    body.classList.remove('off');
    body.classList.add('on');
    // icon
    chrome.browserAction.setIcon({path: "../assets/icon_on_48.png"});
  } else {
    // listener
    bgPage.removeReqListener();
    // popup background
    body.classList.remove('on');
    body.classList.add('off');
    // icon
    chrome.browserAction.setIcon({path: "../assets/icon_off_48.png"});
  }
}
