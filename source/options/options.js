// default redirect options
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

// background page
bgPage = chrome.extension.getBackgroundPage();

// Saves options to chrome.storage
function save_options() {

  // redirects
  var parse_json_error = false;
  var redirect_text = document.getElementById('redirects-text').value;
  var newRedirects = {};
  try {
    newRedirects = JSON.parse(redirect_text);
  } catch(e) {
    console.log("Error parsing JSON: ", e);
    parse_json_error = true;
  }
  if (newRedirects != {}) {
    bgPage.setRedirects(newRedirects);
    console.log("Set new redirects: ", newRedirects);
  }

  // stats
  var stats_consent = document.getElementById('stats-checkbox').checked;

  // set
  chrome.storage.sync.set({stats_cencent: stats_consent});

  var status = document.getElementById('status');
  if (parse_json_error) {
    status.style.color = 'red';
    status.textContent = 'Error parsing JSON. NOT SAVED! Check your JSON.';
  } else {
    status.style.color = 'green';
    status.textContent = 'Options saved.';
    /*setTimeout(function() {
      status.textContent = '';
    }, 1500);*/
  }
}

// loads options from chrome.storage
function restore_options() {
  // redirects
  var redirects = bgPage.getRedirects();
  document.getElementById('redirects-text').value =
    JSON.stringify(redirects, null, " ");
  console.log("redir: ", redirects);

  // stats consent
  chrome.storage.sync.get({
    'stats_consent': true
  }
  , function(items) {
    document.getElementById('stats-checkbox').checked = items.stats_consent;
  });

}

// init
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save').addEventListener('click', save_options);
  restore_options();
});
