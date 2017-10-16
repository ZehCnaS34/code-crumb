'use babel';

import CodeCrumbView from './code-crumb-view';
import { CompositeDisposable } from 'atom';

export default {
  provide: [],

  codeCrumbView: null,
  modalPanel: null,
  subscriptions: null,
  editorPath: null,
  projectPath: null,
  centerWorkspace: null,

  activate(state) {
    this.setPathData(atom.workspace.getCenter().getActivePaneItem());
    this.codeCrumbView = new CodeCrumbView({path: this.editorPath});
    window.view = this.codeCrumbView;
    this.modalPanel = atom.workspace.addTopPanel({
      item: this.codeCrumbView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-crumb:toggle': () => this.toggle()
    }))

    this.subscriptions.add(
      atom.workspace
        .getCenter()
        .onDidStopChangingActivePaneItem((item) => {
          this.setPathData(item);
          this.codeCrumbView.update({
            path: this.editorPath
          });
        })
    );
  },

  setPathData(item) {
    if (item.getPath) {
      this.editorPath = item.getPath();
    } else if (item.getTitle) {
      this.editorPath = item.getTitle();
    } else {
      this.editorPath = 'EMPTY';
    }
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.codeCrumbView.destroy();
  },

  serialize() {
    return {
      codeCrumbViewState: this.codeCrumbView.serialize()
    };
  },

  toggle() {
    // console.log('CodeCrumb was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
