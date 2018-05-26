const database = {
  'facebook': 'https://www.facebook.com/',
  'facebook login': 'https://www.facebook.com/',
  'stackoverflow': 'https://stackoverflow.com/',
  'netflix': 'https://www.netflix.com/',
  'youtube': 'https://www.youtube.com/',
  'gmx': 'https://www.gmx.net/',
  'amazon': 'https://www.amazon.com/',
  'wikipedia': 'https://wikipedia.org/'
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
const filter =  {urls: ['*://*.google.de/*']};
const extraInfoSpec = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(callback, filter, extraInfoSpec);
