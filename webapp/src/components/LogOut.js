import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';

import { logout } from '../actions';

class LogOut extends Component {
  constructor() {
    super();

    this.handleLogOut = this.handleLogOut.bind(this);

  }

  handleLogOut() {
    this.props.sendLogOutRequest()
  }

  render() {
    return (
      <FlatButton 
        label="Log out"  
        style={{paddingTop: 5, paddingBottom: 5, color: 'white'}} 
        onTouchTap={this.handleLogOut}
      />
    )
  }
}

export default connect(null, { sendLogOutRequest: logout })(LogOut);