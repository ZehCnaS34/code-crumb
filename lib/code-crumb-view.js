'use babel';
/** @jsx etch.dom */
const etch = require('etch');
// TODO: use etch for fun.


const buildCrumb = (args) => {
  return (
    <span
      style={{textAlign: 'center'}}
      className="crumb inline-block highlight">
      {
        args.map((arg, i) => (
          <span
            style={{textAlign: 'center'}}
            className="inline-block">
            {(i!==0)?(
              <span
                style={{textAlign: 'center'}}
                className="icon icon-chevron-right">
              </span>
            ):null}
            <span
              style={{textAlign: 'center'}}
              className={`inline-block`}>
              {arg}
            </span>
          </span>
        ))
      }
    </span>
  );
};

export default class CodeCrumbView {

  constructor({path}, children) {
    this.path = path || 'EMPTY';
    etch.initialize(this);
  }

  update({path}, children) {
    console.log('updating')
    this.path = path || 'EMPTY';
    return etch.update(this);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {path: this.path};
  }

  // Tear down any state and detach
  async destroy() {
    // this.crumbLabel.removeEventListener('mousedown', this.clickLabel);
    // this.element.remove();
    await etch.destroy(this);
  }

  render() {
    console.log(this.path);
    return (
      <div>{buildCrumb(this.path.split('/'))}</div>
    );
  }

  getElement() {
    return this.element;
  }

}
