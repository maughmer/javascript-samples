class Accordion extends HTMLElement {

  static observedAttributes = ['data-source', 'multiple'];

  shadow = null;
  wrapper = null;

  dataSource = [];
  openTab = null;
  multiple = false;

  constructor() {
    super();
  }

  //
  // Toggle the target tab. If multiple checked, ignore openTab
  // and just toggle the clicked tab. If not, close the openTab
  // and still toggle the clicked one.
  //
  toggleTab(target) {
    if (target.className === 'open') {
      target.className = '';
      this.openTab = null;
    } else {
      if (this.openTab) {
        this.openTab.className = '';
      }
      target.className = 'open';
      if (!this.multiple) {
        this.openTab = target;
      }
    }
  }

  //
  // If a title bar is clicked, expand or collapse that tab.
  // Arrow function, so the listener can find toggleTab().
  //
  handleExpandCollapse = (event) => {
    if (event.target.matches('div.title')) {
      this.toggleTab(event.currentTarget);
    }
  }

  //
  // User toggled multiple. If currently multiple, close all but
  // the first open tab. Othersise, null out the openTab.
  //
  handleMultipleChecked(checked) {
    if (this.multiple) {
      const open = this.wrapper.getElementsByClassName('open');
      while (open.length > 1) {
        open[1].className = '';
      }
      if (open.length > 0) {
        this.openTab = open[0];
      }
    } else {
      this.openTab = null;
    }
    this.multiple = checked;
  }

  openFirstTab() {
    const sections = this.wrapper.getElementsByTagName('section');
    this.openTab = sections[0];
    this.toggleTab(this.openTab);
  }

  createSection(id) {
    const section = document.createElement('section');
    const attr = document.createAttribute('id');
    attr.value = id;
    section.setAttributeNode(attr);
    section.addEventListener('click', this.handleExpandCollapse);
  
    return section;
  }

  //
  // Sort our data by title, accommodating for 'The' at
  // the start of a title. Ignoring 'A' and 'An' for now.
  //
  sortByTitle(data) {
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
  async getData() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error('Could not load data.');
      }
      const data = await response.json();
      this.sortByTitle(data);
      this.dataSource = [...data];
      this.setAttribute('data-source', 'dataSource');
    } catch (error) {
      status.innerText = error.message;
      status.className = 'error';
    }
  }

  connectedCallback() {
    console.log('accordion added to page');
    this.getData();
  }

  disconnectedCallback() {
    console.log('accordion removed from page');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);

    if (name === 'multiple') {
      this.handleMultipleChecked(newValue === 'true');
      return;
    }

    if (name !== 'data-source') {
      return;
    }

    // Create a shadow root
    this.shadow = this.attachShadow({ mode: "open" });

    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'wrapper');

    this.dataSource.forEach(entry => {
      const section = this.createSection(entry.id);
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
      this.wrapper.appendChild(section);
    });

    // Apply Material icons to the shadow dom
    const iconElem = document.createElement('link');
    iconElem.setAttribute('rel', 'stylesheet');
    iconElem.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    // Apply external styles to the shadow dom
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "accordion.css");

    // Attach the created elements to the shadow dom
    this.shadow.appendChild(iconElem);
    this.shadow.appendChild(linkElem);
    this.shadow.appendChild(this.wrapper);

    this.openFirstTab();
  }

}

customElements.define('custom-accordion', Accordion);
