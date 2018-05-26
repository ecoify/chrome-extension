window.onload = function () {

  console.log("ecoify popup opened");

  var carbon_grams = document.getElementById('carbon_grams');

  // update carbon grams counter
  readCounter().then((counter) => {
    console.log("read counter: ", counter);
    new_carbon_grams = counter*0.2;
    var new_carbon_grams_text;

    if (new_carbon_grams < 1000) {
<<<<<<< HEAD
      new_carbon_grams_text = parseFloat((new_carbon_grams).toFixed(4)) + "g";
    } else if (new_carbon_grams < 1000000) {
      new_carbon_grams_text = parseFloat((new_carbon_grams/1000).toFixed(4)) + "kg";
    } else {
      new_carbon_grams_text = parseFloat((new_carbon_grams/1000000).toFixed(4)) + "t";
=======
      new_carbon_grams_text = new_carbon_grams+" g";
    } else if (new_carbon_grams < 1000000) {
      new_carbon_grams_text = new_carbon_grams/1000 + " kg";
    } else {
      new_carbon_grams_text = new_carbon_grams_text/1000000 + " t";
>>>>>>> 97b7d0ddd185d1f547b0a47508c51f4ada7fa8f1
    }

    carbon_grams.innerHTML = new_carbon_grams_text;
  });

}

function readCounter() {
  return new Promise((resolve, reject) => {
    getData("blockedCounter").then((counter) => {
      if (typeof counter === 'undefined' || isNaN(counter)) {
        counter = 0;
      }
      console.log(counter)
      resolve(counter)
    })
  })
}

function getData(sKey) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(sKey, function (items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(items[sKey]);
      }
    });
  });
}
