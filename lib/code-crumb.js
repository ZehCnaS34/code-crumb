'use babel';

import CodeCrumbView from './code-crumb-view';
import CommandView from './command-view';
import { CompositeDisposable } from 'atom';

export default {
  provide: [],

  config: {
    location: {
      type: 'string',
      default: 'Top',
      enum: [
        {value: 'Top', description: 'Top'},
        {value: 'Bottom', description: 'Bottom'}
      ]
    },
    openedByDefault: {
      type: 'boolean',
      default: true
    }
  },

  codeCrumbView: null,
  modalPanel: null,
  subscriptions: null,
  editorPath: null,
  projectPath: null,
  centerWorkspace: null,
  activeItem: null,

  commandView: null,
  commandPanel: null,

  activate(state) {
    this.activeItem = atom.workspace.getCenter().getActivePaneItem();
    this.setPathData(this.activeItem);
    this.codeCrumbView = new CodeCrumbView({
      path: this.editorPath, icon: this.icon
    });
    // TODO: make the location of the pannel configurable.

    this.commandView = new CommandView();
    this.commandPanel = atom.workspace.addBottomPanel({
      item: this.commandView.element,
      visible: true
    })
    
    this.modalPanel = this.addPanel({
      item: this.codeCrumbView.getElement(),
      visible: atom.config.get('code-crumb.openedByDefault')
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
          this.activeItem = item;
          this.setPathData(item);
          this.codeCrumbView.update({
            path: this.editorPath,
            icon: this.icon
          });
        })
    );

    this.subscriptions.add(
      atom.config.onDidChange('code-crumb.location', ({oldValue, newValue}) => {
        const visible = this.modalPanel.isVisible();
        const newCodeCrumbView = new CodeCrumbView(this.codeCrumbView.serialize());

        this.setPathData(this.activeItem);
        this.modalPanel.destroy();
        this.codeCrumbView = newCodeCrumbView;
        this.modalPanel = this.addPanel({
          item: this.codeCrumbView.getElement(),
          visible: atom.config.get('code-crumb.openedByDefault')
        })
      })
    )
  },

  addPanel(obj) {
    const location = atom.config.get('code-crumb.location');
    return atom.workspace[`add${location}Panel`](obj)
  },

  setPathData(item) {
    if(!item) {
      return;
    }

    if (item.getPath) {
      const newPath = item.getPath() || item.getTitle();

      if (newPath.length > 0 && newPath[0] === '/') {
        this.editorPath = newPath.slice(1);
        this.icon = 'file-text';
      } else {
        this.editorPath = newPath;
      }
    } else if (item.getTitle) {
      this.editorPath = item.getTitle();
      this.icon = 'tools';
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
    this.commandPanel.isVisible() ? this.commandPanel.hide() : this.commandPanel.show()
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
