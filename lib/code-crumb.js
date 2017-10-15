'use babel';

import CodeCrumbView from './code-crumb-view';
import { CompositeDisposable } from 'atom';

export default {
  provide: [],

  codeCrumbView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.codeCrumbView = new CodeCrumbView(state.codeCrumbViewState);
    this.modalPanel = atom.workspace.addTopPanel({
      item: this.codeCrumbView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-crumb:toggle': () => this.toggle()
    }));
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
    console.log('CodeCrumb was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
