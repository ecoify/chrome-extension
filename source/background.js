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
    const match = details.url.match(/&oq=(.+?)&/);
    if (match) {
      const newUrl = database[match[1]];
      if (newUrl) {
        console.log('ecoify safed 2 g CO2 for: ', match[1]);
        return {redirectUrl: newUrl};
      }
    }
  }
  catch (error) {
    console.error(error);
  }
};
const filter =  {urls: ['*://*.google.de/*', '*://*.google.com/*']};
const extraInfoSpec = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(callback, filter, extraInfoSpec);
