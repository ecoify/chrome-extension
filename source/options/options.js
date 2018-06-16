// background page
bgPage = chrome.extension.getBackgroundPage();

// Saves options to chrome.storage
function save_options() {
  // redirects
  let parse_json_error = false;
  let newRedirects = {};
  try {
    newRedirects = JSON.parse(document.getElementById('redirects-text').value);
  } catch(e) {
    //console.log("Error parsing JSON: ", e);
    parse_json_error = true;
  }
  if (!parse_json_error) {
    bgPage.setRedirects(newRedirects);
  }

  // stats
  const stats_consent = document.getElementById('stats-checkbox').checked;
  bgPage.setStatsConsent(stats_consent);

  const status = document.getElementById('status');
  if (parse_json_error) {
    status.style.color = 'red';
    status.textContent = 'Error parsing JSON. NOT SAVED! Check your JSON.';
  } else {
    status.style.color = 'green';
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      window.close();
    }, 1500);
  }
}

// loads options from chrome.storage
function restore_options() {
  // redirects
  document.getElementById('redirects-text').value =
    JSON.stringify(bgPage.getRedirects(), null, " ");
  document.getElementById('stats-checkbox').checked = bgPage.getStatsConsent();
}

// init
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save').addEventListener('click', save_options);
  restore_options();
});
