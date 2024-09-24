//
// User toggled multiple. If currently multiple, close all but
// the first open tab. Otherwise, null out the openTab.
//
function handleMultipleChecked(event) {
  const accordion = document.getElementsByTagName('custom-accordion')[0];
  accordion.setAttribute('multiple', event.target.checked);
}

//
// Load and process our sample accordion data.
//
// A 'Loading...' message appears on screen while data is loading.
// User must be hosting this sample, e.g. using http-server.
//
// On successful load, the accordion is shown along with some notes.
// In this case, a brief message that the descriptions in the sample
// data were culled from Wikipedia.
//
// On failure, an error is shown.
//

function hideLoading() {
  status.style.display = 'none';
}

function showNotes() {
  const notes = document.getElementById('notes');
  notes.style.display = 'block';
}
