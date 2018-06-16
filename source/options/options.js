// default redirect options


// Saves options to chrome.storage
function save_options() {
  var redirect_text = document.getElementById('redirect-textarea').value;
  var stats = document.getElementById('stats-checkbox').checked;
  chrome.storage.sync.set({
    stats_consent: stats
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// loads options from chrome.storage
function restore_options() {
  chrome.storage.sync.get({
    stats_consent: true,

  }, function(items) {
    document.getElementById('stats-checkbox').checked = items.stats_consent;
  });
}

// init
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save').addEventListener('click', save_options);
  restore_options();
});
