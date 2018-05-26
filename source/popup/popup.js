document.addEventListener('DOMContentLoaded', function() {

  console.log("ecoify popup opened");

  // toggle
  var toggle = document.getElementById('toggle');
  readToggle().then((new_toggle) => {
    toggle.checked = new_toggle;
    updateStyleToggle(toggle.checked);
  });
  toggle.addEventListener('click', function() {
    setToggle(toggle.checked);
    updateStyleToggle(toggle.checked);
  });

  // update carbon grams counter
  var carbon_grams = document.getElementById('carbon_grams');
  readCounter().then((counter) => {
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


function updateStyleToggle(toggle) {
  var body = document.getElementsByTagName("BODY")[0];
  if (toggle) {
    body.classList.remove('off');
    body.classList.add('on');
  } else {
    body.classList.remove('on');
    body.classList.add('off');
  }
}

function readToggle() {
  return new Promise((resolve, reject) => {
    getData("ecoify_toggle").then((ecoify_toggle) => {
      if (typeof ecoify_toggle === 'undefined' || isNaN(ecoify_toggle)) {
        ecoify_toggle = true;
      }
      resolve(ecoify_toggle)
    })
  })
}

function setToggle(new_ecoify_toggle) {
  console.log("toggled to: ", new_ecoify_toggle);
  if (new_ecoify_toggle === true || new_ecoify_toggle === false) {
    setData("ecoify_toggle", new_ecoify_toggle);
  }
}

function readCounter() {
  return new Promise((resolve, reject) => {
    getData('blockedCounter').then((counter) => {
      if (typeof counter === 'undefined' || isNaN(counter)) {
        counter = 0;
      }
      resolve(counter)
    })
  })
}

function getData(sKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(sKey, (items) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(items[sKey]);
      }
    });
  });
}

function setData(sKey, sValue) {
  return new Promise((resolve, reject) => {
    const data = {}
    data[sKey] = sValue
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(true);
      }
    });
  });
}
