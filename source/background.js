const database = {
  'facebook': 'https://www.facebook.com/',
  'fb': 'https://www.facebook.com/',
  'facebook log in': 'https://www.facebook.com/',
  'facebook login': 'https://www.facebook.com/',
  'facebook.com': 'https://www.facebook.com/',
  'facebook.de': 'https://www.facebook.de/',
  'stackoverflow': 'https://stackoverflow.com/',
  'stackoverflow.com': 'https://stackoverflow.com/',
  'netflix': 'https://www.netflix.com/',
  'netflix.com': 'https://www.netflix.com/',
  'youtube': 'https://www.youtube.com/',
  'youtube.com': 'https://www.youtube.com/',
  'youtube.de': 'https://www.youtube.de/',
  'gmx': 'https://www.gmx.net/',
  'gmx.net': 'https://www.gmx.net/',
  'gmx.de': 'https://www.gmx.de/',
  'amazon': 'https://www.amazon.com/',
  'amazon.com': 'https://www.amazon.com/',
  'wikipedia': 'https://wikipedia.org/',
  'wikipedia.de': 'https://wikipedia.de/',
  'twitter': 'https://twitter.com/',
  'twitter.com': 'https://twitter.com/',
  'ebay': 'https://www.ebay.com/',
  'ebay.com': 'https://www.ebay.com/',
  'instagram': 'https://www.instagram.com/',
  'instagram.com': 'https://www.instagram.com/',
}

const callback = function (details) {
  try {
    if (/[&?]q=(.+?)&/.test(details.url) && /[&?]oq=(.+?)&/.test(details.url)) {
      const term = details.url.match(/[&?]q=(.+?)&/)[1]
      const newUrl = database[term];
      if (newUrl) {
        increaseCounter()
        console.log('ecoify safed 2 g CO2 for: ', term);
        return { redirectUrl: newUrl };
      }
    }
  }
  catch (error) {
    console.error(error);
  }
};
const filter = { urls: ['*://*.google.de/*', '*://*.google.com/*'] };
const extraInfoSpec = ['blocking'];

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

function setData(sKey, sValue) {
  return new Promise(function (resolve, reject) {
    var data = {};
    data[sKey] = sValue;
    chrome.storage.sync.set(data, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(true);
      }
    });
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

function increaseCounter() {
  readCounter().then((counter) => {
    var updatedCounter = counter + 1
    setData("blockedCounter", updatedCounter).then(() => {
      console.log("increased counter", updatedCounter)
      readCounter()
    })
  })
}

chrome.webRequest.onBeforeRequest.addListener(callback, filter, extraInfoSpec);
