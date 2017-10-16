'use babel';
/** @jsx etch.dom */
const etch = require('etch');
// TODO: use etch for fun.


const buildCrumb = (args, options) => {
  const {
    path, icon
  } = options;

  return (
    <span
      style={{textAlign: 'center'}}
      className="crumb inline-block">
      {
        args.map((arg, i) => (
          <span
            style={{textAlign: 'center'}} >
            {(i!==0)?(
              <span
                style={{textAlign: 'center'}}
                className={`icon icon-chevron-right`}>
              </span>
            ):(
              <span
                style={{textAlign: 'center'}}
                className={`icon icon-${icon}`}>
              </span>
            )}
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

  constructor({path, icon}, children) {
    this.path = path || 'EMPTY';
    this.icon = icon || 'chevron-right';
    etch.initialize(this);
  }

  update({path, icon}, children) {
    this.path = path || this.path;
    this.icon = icon || this.icon;
    return etch.update(this);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      path: this.path,
      icon: this.icon,
    };
  }

  // Tear down any state and detach
  async destroy() {
    // this.crumbLabel.removeEventListener('mousedown', this.clickLabel);
    // this.element.remove();
    await etch.destroy(this);
  }

  render() {
    return (
      <div className="padded">
        {/* <button className="btn btn-sm inline-block icon icon-chevron-down">Files</button> */}
        {
          buildCrumb(this.path.split('/'), {
            icon: this.icon,
            path: this.path,
          })
        }
      </div>
    );
  }

  getElement() {
    return this.element;
  }

}
