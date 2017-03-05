import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';

import LogOut from '../components/LogOut';
import LogIn from '../components/LogIn';

import { 
  resetErrorMessage, 
  generateKeyPair, 
  publicKey 
} from '../actions';

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node
  }

  state = {
    isDrawerOpen: false
  }

  toggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen })
  }

  handleDismissClick = (e) => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  renderErrorMessage = () => {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  handleKeyPairGeneration = () => {
    this.props.generateKeyPair()
    this.props.publicKey()
  } 

  constructor(props) {
    super(props)

    this.handleKeyPairGeneration = this.handleKeyPairGeneration.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  render() {
    const { children, inputValue } = this.props
    return (
      <div>
        <AppBar
          title="LibChain"
          onLeftIconButtonTouchTap={this.toggleDrawer}
          iconElementRight={this.props.isLogged ? <LogOut /> : <LogIn />}
        />
        <Drawer 
          open={this.state.isDrawerOpen}
          docked={false}
          onRequestChange={(open) => this.setState({ isDrawerOpen: open })}
        >
          <Subheader>Options</Subheader>
          <MenuItem onTouchTap={this.handleKeyPairGeneration}>Generate Key Pair</MenuItem>
        </Drawer>
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  isLogged: state.login.jwt !== null
})

export default connect(mapStateToProps, {
  resetErrorMessage,
  generateKeyPair,
  publicKey
})(App)
