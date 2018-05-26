var callback = function(details) {
  console.log(details.url)
};
var filter =  {urls: ["*://*.google.de/*"]};
var opt_extraInfoSpec = [];

chrome.runtime.webRequest.onBeforeRequest.addListener(
  callback, filter, opt_extraInfoSpec);
