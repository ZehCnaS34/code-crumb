
export default class BreadCrumbNodeView {
  constructor(serializedState) {
    let output = document.createElement('span');
    output.classList.add('crumb')
    output.classList.add('inline-block')
    output.classList.add('highlight')
    output.style.textAlign = 'center';
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      let arrowContainer = document.createElement('span');
      arrowContainer.classList.add('inline-block');

      let arrow = document.createElement('span');
      arrow.classList.add('inline-block');
      arrow.style.textAlign = 'center';

      let textSpan = document.createElement('span');
      textSpan.classList.add('inline-block');
      textSpan.style.textAlign = 'center';
      textSpan.textContent = arg;
      if (i !== 0) {
        arrow.classList.add('icon');
        arrow.classList.add('icon-chevron-right');
      }
      if (i === active) {
        textSpan.classList.add('highlight');
        textSpan.classList.add('highlight-info');
      }
      arrowContainer.appendChild(arrow);
      arrowContainer.appendChild(textSpan);

      output.appendChild(arrowContainer);
    }

    this.element.appendChild(output);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    // this.crumbLabel.removeEventListener('mousedown', this.clickLabel);
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
