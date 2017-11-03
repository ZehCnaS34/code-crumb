'use babel';
/** @jsx etch.dom */
import { CompositeDisposable } from 'atom';
const {filter} = require('fuzzaldrin');
const etch = require('etch');
const fs = require('fs');
const path = require('path');


class CommandMap {
  constructor() {
  }
}



export default class CommandView {
  constructor(props, children) {
    this.cursor = 0;
    this.nodes = []
    etch.initialize(this);
    this.currentDirectory = atom.project.getDirectories()[0].path;

    this.editor = this.refs.commandLine.getModel();
    for (let gutter of this.editor.getGutters()) {
      gutter.hide()
    }

    // setup subscriptions
    this.subs = new CompositeDisposable();
    this.subs.add(
      this.editor.onDidChange((e) => {
        // this.parseCommand();
        this.fetchNodes(this.editor.getText())
      })
    );
    this.subs.add(
      this.editor.onDidChangeCursorPosition(this.handleEnter.bind(this))
    )

    window.dis = this;
    this.fetchNodes("");
  }

  handleEnter(e) {
    if (e.newBufferPosition.row < 1) return;
    let node = this.nodes[this.cursor];
    let newPath = path.join(this.currentDirectory, node);
    this.openFile(newPath);
    this.editor.backspace();
    this.editor.setText('');
    console.log(node);
  }

  openFile(np) {
    fs.stat(np, (err, stat) => {
      if (stat.isDirectory()) {
        this.currentDirectory = np
        this.fetchNodes('');
        return;
      }
      atom.workspace.open(np);
      this.currentDirectory = atom.project.getDirectories()[0].path;
    })
  }

  fetchNodes(command) {
    fs.readdir(this.currentDirectory, (err, nodes) => {
      nodes = filter(nodes, command)
      this.update({
        nodes
      })
    });
  }

  update(props, children) {
    this.nodes = props.nodes || [];
    etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
    this.subs.dispose();
  }

  serialize() {
    return {};
  }

  render() {
    return (
      <div>
        <atom-panel className="padded">
          <span>
            {
              this.nodes.map((n, i) => (
                <span
                  className={`inline-block highlight ${(i==this.cursor)?'highlight-info':''}`}>
                  {n}
                </span>
              ))
            }
          </span>
        </atom-panel>
        <atom-panel className="padded">
          <atom-text-editor ref="commandLine" min>
          </atom-text-editor>
        </atom-panel>
      </div>
    );
  }

  getElement() {
    return this.element;
  }
}
