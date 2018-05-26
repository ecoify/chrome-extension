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
  toggle.addEventListener('click', function() {
    bgPage.setToggle(toggle.checked);
    updateToggle(toggle.checked);
  });

  // update carbon grams counter
  var carbon_grams = document.getElementById('carbon_grams');
  bgPage.readCounter().then((counter) => {
    console.log("read counter: ", counter);
    new_carbon_grams = counter*0.2;
    var new_carbon_grams_text;

    if (new_carbon_grams < 1000) {
      new_carbon_grams_text = parseFloat((new_carbon_grams).toFixed(4)) + " g";
    } else if (new_carbon_grams < 1000000) {
      new_carbon_grams_text = parseFloat((new_carbon_grams/1000).toFixed(4)) + " kg";
    } else {
      new_carbon_grams_text = parseFloat((new_carbon_grams/1000000).toFixed(4)) + " t";
    }

    carbon_grams.innerHTML = new_carbon_grams_text;
  });

}, false);


function updateToggle(toggle) {
  var body = document.getElementsByTagName("BODY")[0];
  var bgPage = chrome.extension.getBackgroundPage();
  if (toggle) {
    bgPage.addReqListener();
    body.classList.remove('off');
    body.classList.add('on');
  } else {
    bgPage.removeReqListener();
    body.classList.remove('on');
    body.classList.add('off');
  }
}
