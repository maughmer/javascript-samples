const accordion = document.getElementsByTagName('custom-accordion')[0];
const status = document.getElementById('status');

//
// User toggled multiple. If currently multiple, close all but
// the first open tab. Otherwise, null out the openTab.
//
function handleMultipleChecked(event) {
  accordion.setAttribute('multiple', event.target.checked);
}

//
// A 'loading' message appears on screen, while the data is loading.
// User must be hosting this sample, e.g. using http-server.
//
// On successful load, the accordion shows the data and dispatches an
// event, so we can upate the host UI accordingly.
//
accordion.addEventListener('data-loaded', error => {
  // hide 'Loading data...' status
  status.style.display = 'none';

  // enable Allow Multiple checkbox
  const checkbox = document.getElementsByTagName('input')[0];
  checkbox.removeAttribute('disabled');

  // show notes
  const notes = document.getElementById('notes');
  notes.style.display = 'block';
});

//
// On failure, an error is shown.
//
accordion.addEventListener('data-error', error => {
  status.innerText = error.detail;
  status.className = 'error';
});
