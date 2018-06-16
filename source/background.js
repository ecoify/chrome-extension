// defaults
const redirects_default = {
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
  'pinterest': 'https://www.pinterest.de/',
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
};
var req_listener_active = false;

// get redirects
function loadRedirects() {
  chrome.storage.sync.get(
    {'redirects': redirects_default},
    (items) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
         this.redirects = items['redirects'];
         console.log("loaded redirects: ", this.redirects);
      }
    }
  );
}

function getRedirects() {
  return this.redirects;
}

function setRedirects(redirects) {
  this.redirects = redirects;
  setData('redirects', redirects);
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
  if (new_ecoify_toggle === true || new_ecoify_toggle === false) {
    setData("ecoify_toggle", new_ecoify_toggle);
  }
}

// update Rules API – not using: see options
/*
function setAllRules(database) {
  setData('rules', database)
}

function getAllRules() {
  return new Promise((resolve, reject) => {
    getData('rules').then((ruleset) => {
      if (typeof ruleset === 'undefined') {
        setAllRules(database)
        resolve(database)
      } else {
        resolve(ruleset)
      }
    })
  })
}

function createRule(source, target) {
  return new Promise((resolve, reject) => {
    getAllRules().then((ruleset) => {
      if (source && target) {
        ruleset[source] = target
        setAllRules(ruleset)
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

function updateRule(source, target) {
  createRule(source, target)
}

function deleteRule(source) {
  updateRule(source, undefined)
}
*/

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

function increaseCounter() {
  readCounter().then((counter) =>
    setData('blockedCounter', counter + 1)
  )
}

function req_callback(details) {
  try {
    if (/[&?]q=(.+?)&/.test(details.url) && /[&?]oq=(.+?)&/.test(details.url)) {
      const term = details.url.match(/[&?]q=(.+?)&/)[1]
      if (this.redirects && this.redirects[term]) {
        increaseCounter()
        return { redirectUrl: this.redirects[term] };
      }
    }
  }
  catch (error) {
    console.error(error);
  }
};

const filter = { urls: ['*://*.google.de/*', '*://*.google.com/*'] };
const extraInfoSpec = ['blocking'];
function addReqListener() {
  if (!req_listener_active) {
    chrome.webRequest.onBeforeRequest.addListener(req_callback, filter,
      extraInfoSpec);
    req_listener_active = true;
    setToggle(true);
  }
  chrome.browserAction.setIcon({path: "../assets/icon_on_48.png"});
}

function removeReqListener() {
  if (req_listener_active) {
    chrome.webRequest.onBeforeRequest.removeListener(req_callback);
    req_listener_active = false;
    setToggle(false);
  }
  chrome.browserAction.setIcon({path: "../assets/icon_off_48.png"});
}

// Init
var startup = () => {
  // get redirects
  loadRedirects();

  // toggle
  const togglePromise = readToggle();
  togglePromise.then((toggle) => {
    if (toggle) {
      addReqListener();
    } else {
      removeReqListener();
    }
  });
}

startup();
