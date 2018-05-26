var callback = function(details) {
  console.log("ecoify: ", details.url);
};
var filter =  {urls: ["*://*.google.de/*"]};
var opt_extraInfoSpec = [];

chrome.webRequest.onBeforeRequest.addListener(
  callback, filter, opt_extraInfoSpec);
