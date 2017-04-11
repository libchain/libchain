import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import LogOut from '../components/LogOut';
import FormDialog from '../components/FormDialog';

import { 
  resetErrorMessage, 
  generateKeyPair, 
  publicKey 
} from '../actions';

class FormDialogMenu extends Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon color='white' /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Log In" onTouchTap={() => this.props.openDialog('logIn')}/>
        <MenuItem primaryText="Sign In" onTouchTap={() => this.props.openDialog('signIn')}/>
      </IconMenu>
    );
  } 
}

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node
  }

  state = {
    isDrawerOpen: false,
    logIn: false,
    signIn: false
  }

  toggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen })
  }

  handleDismissClick = (e) => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  openDialog = (dialogType) => {
    console.log(dialogType)
    this.setState({  
      [dialogType]: !this.state[dialogType],
      [dialogType==='signIn'?'logIn':'signIn']: !this.state[dialogType] ? false : false
    })
  }

  componentWillReceiveProps = (nextProps, nextState) => {
    if (nextProps.isLogged !== this.props.isLogged) {
      this.setState({ logIn: false, signIn: false }) 
    }
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

  handleNav = (destination) => {
    let path = '';
    path = destination === 'books' ? '/library' : '/statistics'

    browserHistory.push(path)

    this.toggleDrawer()
  }

  constructor(props) {
    super(props)

    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  render() {
    const { children, inputValue } = this.props
    return (
      <div>
        <AppBar
          title="LibChain"
          onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)}
          iconElementRight={this.props.isLogged ? <LogOut /> : <FormDialogMenu openDialog={this.openDialog.bind(this)} />}
        />
        <Drawer 
          open={this.state.isDrawerOpen}
          docked={false}
          onRequestChange={(open) => this.setState({ isDrawerOpen: open })}
        >
          <Subheader>Options</Subheader>
          <MenuItem onTouchTap={this.handleNav.bind(this, 'libraryBooks')}>Books</MenuItem>
          <MenuItem onTouchTap={this.handleNav.bind(this, 'adminBooks')}>Admin</MenuItem>
          <MenuItem onTouchTap={this.handleNav.bind(this, 'statistics')}>Statistics</MenuItem>
        </Drawer>
        <hr />
        <FormDialog type='logIn' shouldBeOpen={this.state.logIn && !this.props.isLogged}/>
        <FormDialog type='signIn' shouldBeOpen={this.state.signIn && !this.props.isLogged}/>
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  isLogged: state.login.jwt !== null,
  ...ownProps
})

export default connect(mapStateToProps, {
  resetErrorMessage,
  generateKeyPair,
  publicKey
})(App)
