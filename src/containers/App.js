import React, {
  Component,
  cloneElement
} from 'react';

import {
  getStore,
  addChangeListener
} from 'tbg-flux-factory';

const {shell, remote} = require('electron')


const authStore = getStore('auth');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, authStore.getState(), {});

    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
    this.handleQuitClick = this.handleQuitClick.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
  }
  componentWillMount() {
    authStore.addChangeListener(this.handleStoreUpdate);
  }

  componentWillUnmount() {
    authStore.removeChangeListener(this.handleStoreUpdate);
  }

  handleStoreUpdate() {
    this.setState(Object.assign({}, authStore.getState()), () => {
      if (!this.state.loggedIn) {
        this.context.router.push('/login')
      }
    });
  }

  handleQuitClick() {
    authStore.Actions.logout();
    const appWindow = remote.getCurrentWindow();
    appWindow.close();
  }

  handleAvatarClick() {
    shell.openExternal(`${this.state.account.URL}#people/${this.state.account.userId}/time`);
  }


  render() {
    return (
      <div className={`main-app ${window.webVersion ? 'web-version' : ''}`}>
        <div className="background" />
        {cloneElement(this.props.children, this.state)}
        <ul className='toolbar'>
          <li className='left' onClick={this.handleAvatarClick}>
            <img src={this.state.account['avatar-url']} className='avatar' />
          </li>
          <li onClick={this.handleQuitClick}><i className='fa fa-power-off' /></li>
        </ul>
      </div>
    );
  }
}

export default App;

App.contextTypes = {
  router: React.PropTypes.object
};
