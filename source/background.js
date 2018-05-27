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

function req_callback(details) {
  try {
    if (/[&?]q=(.+?)&/.test(details.url) && /[&?]oq=(.+?)&/.test(details.url)) {
      const term = details.url.match(/[&?]q=(.+?)&/)[1]
      const newUrl = database[term];
      if (newUrl) {
        increaseCounter()
        console.log('ecoify safed 0.2 g CO2 for: ', term);
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
  console.log("toggled to: ", new_ecoify_toggle);
  if (new_ecoify_toggle === true || new_ecoify_toggle === false) {
    setData("ecoify_toggle", new_ecoify_toggle);
  }
}

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

var req_listener_active = false;

function addReqListener() {
  if (req_listener_active) {
    console.log("request event listener already active");
  } else {
    chrome.webRequest.onBeforeRequest.addListener(req_callback, filter, extraInfoSpec);
    req_listener_active = true;
    setToggle(true);
    console.log("added request event listener");
  }
  chrome.browserAction.setIcon({path: "../assets/icon_on_48.png"});
}

function removeReqListener() {
  if (req_listener_active) {
    chrome.webRequest.onBeforeRequest.removeListener(req_callback);
    req_listener_active = false;
    setToggle(false);
    console.log("removed request event listener");
  } else {
    console.log("request event listener is not active");
  }
  chrome.browserAction.setIcon({path: "../assets/icon_off_48.png"});
}

// Init
function startup() {
  const togglePromise = readToggle();

  togglePromise.then((toggle) => {
    console.log("startup, toggle: ", toggle);

    if (toggle) {
      addReqListener();
    } else {
      removeReqListener();
    }
  });
  
}


// startup
startup();
