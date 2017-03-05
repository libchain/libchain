import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import { login } from '../actions';

import LogInForm from './LogInForm';
import Loading from './Loading';

class LogIn extends Component {
  state = {
    canSubmit: false,
    dialogOpen: false
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
    })
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    })
  }

  handleOpen = () => {
    this.setState({ 
      dialogOpen: true 
    })
  }

  handleClose = () => {
    /* Close if no log in errors */
    this.setState({ 
      dialogOpen: false 
    })
  }

  setFormRef = (formReference) => {
    this.form = formReference
  }

  /**
    * Sends log in request to server
    */
  triggerFormSubmit = () => {
    if (this.state.canSubmit) {
      this.form.submit()      
    }
  }

  handleSubmit = (data) => {
      console.log(data)
      this.setState({ dialogOpen: false })
      this.props.sendLoginRequest(data)
  }

  constructor() {
    super();


    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  render() {
    if (this.props.isLoading) {
      return <Loading />
    }

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Log In"
        primary={true}
        disabled={!this.state.canSubmit}
        onTouchTap={this.triggerFormSubmit}
      />,
    ];

    return (
      <div>
        <FlatButton 
          label="Log in" 
          style={{paddingTop: 5, paddingBottom: 5, color: 'white'}} 
          onTouchTap={this.handleOpen}
        />
        <Dialog
          title="Log In"
          actions={actions}
          contentStyle={{width: '40%'}}
          titleStyle={{fontWeight: 100, padding: '16px 24px'}}
          open={this.state.dialogOpen}
          modal={true}
        >
          <LogInForm 
            submitForm={this.handleSubmit} 
            setFormRef={this.setFormRef.bind(this)}
            enableButton={this.enableButton}
            disableButton={this.disableButton}
          />
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.login.isLoading
})

export default connect(mapStateToProps, {
  sendLoginRequest: login,
})(LogIn);