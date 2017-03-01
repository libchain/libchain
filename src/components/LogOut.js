import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

import { request } from 'superagent';

class LogOut extends Component {
  handleLogOut() {
    request
      .post('/api/logout')
      .send('user') // get the user through props
      .then((res, err) => {
        // DO SOMETHING 
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <FlatButton label="Log out"  style={{paddingTop: 5, color: 'white'}} />
    )
  }
}

export default LogOut;