const accordion = document.getElementById('accordion');
const status = document.getElementById('status');

let openTab;
let multiple = false;

//
// Toggle the target tab. If multiple checked, ignore openTab
// and just toggle the clicked tab. If not, close the openTab
// and still toggle the clicked one.
//
function toggleTab(target) {
  if (target.className === 'open') {
    target.className = '';
    openTab = null;
  } else {
    if (openTab) {
      openTab.className = '';
    }
    target.className = 'open';
    if (!multiple) {
      openTab = target;
    }
  }
}

//
// If a title bar is clicked, expand or collapse that tab.
//
function handleExpandCollapse(event) {
  if (event.target.matches('div.title')) {
    toggleTab(event.currentTarget);
  }
}

//
// User toggled multiple. If currently multiple, close all but
// the first open tab. Othersise, null out the openTab.
//
function handleMultipleChecked(event) {
  if (multiple) {
    const open = accordion.getElementsByClassName('open');
    while (open.length > 1) {
      open[1].className = '';
    }
    if (open.length > 0) {
      openTab = open[0];
    }
  } else {
    openTab = null;
  }
  multiple = event.target.checked;
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

function openFirstTab() {
  const sections = accordion.getElementsByTagName('section');
  openTab = sections[0];
  toggleTab(openTab);
}

function createSection(id) {
  const section = document.createElement('section');
  const attr = document.createAttribute('id');
  attr.value = id;
  section.setAttributeNode(attr);
  section.addEventListener('click', handleExpandCollapse);

  return section;
}

function populateAccordion(entries) {
  entries.forEach(entry => {
    const section = createSection(entry.id);
    const html = `
      <div class="title-section">
        <div class="title">
          <span>${entry.title}</span>
          <div class="collapse"><span class="material-symbols-outlined">arrow_drop_up</span></div>
          <div class="expand"><span class="material-symbols-outlined">arrow_drop_down</span></div>
        </div>
      </div>
      <div class="description">
        <p>
          ${entry.description}
        </p>
      </div>
    `;
    section.innerHTML = html;
    accordion.appendChild(section);
  });
  hideLoading();
  openFirstTab();
  showNotes();
}

//
// Sort our data by title, accommodating for 'The' at
// the start of a title. Ignoring 'A' and 'An' for now.
//
function sortByTitle(data) {
  data.sort((a, b) => {
    let aTmp = a.title;
    let bTmp = b.title;
    if (aTmp.startsWith('The ')) {
      aTmp = aTmp.substring(4);
    }
    if (bTmp.startsWith('The ')) {
      bTmp = bTmp.substring(4);
    }
    return aTmp < bTmp ? -1 : 1;
  });
}

//
// Load our data. This function is self-calling.
//
(async function getData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Could not load data.');
    }
    const data = await response.json();
    sortByTitle(data);
    populateAccordion(data);
  } catch (error) {
    status.innerText = error.message;
    status.className = 'error';
  }
})();
