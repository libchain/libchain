import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';

import { login, createAccount } from '../actions';

import EmailPassForm from './EmailPassForm';
import Loading from './Loading';

class FormDialog extends Component {
 /* state = {
    canSubmit: false,
    dialogOpen: false
  }*/

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
    console.log(this.props.type)
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
    const { type } = this.props

    this.setState({ dialogOpen: false })
    if (type === 'logIn') {
      this.props.sendLoginRequest(data)
    } else {
      this.props.sendCreateAccountRequest(data)
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      dialogOpen: props.shouldBeOpen
    }

    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.shouldBeOpen)
    this.setState({ dialogOpen: nextProps.shouldBeOpen })
  }

  render() {
    const { type } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={type === 'logIn' ? 'Log in' : 'Sign in'}
        primary={true}
        disabled={!this.state.canSubmit}
        onTouchTap={this.triggerFormSubmit}
      />,
    ];

    if (this.props.isLoading) {
      return <Loading />
    }    

    return (
        <Dialog
            title={type === 'logIn' ? 'Log in' : 'Sign in'} 
            actions={actions}
            contentStyle={{width: '40%'}}
            titleStyle={{fontWeight: 100, padding: '16px 24px'}}
            open={this.state.dialogOpen}
            modal={true}
          >
          <EmailPassForm 
            submitForm={this.handleSubmit} 
            setFormRef={this.setFormRef.bind(this)}
            enableButton={this.enableButton}
            disableButton={this.disableButton}
          />
        </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.login.isLoading,
  ...ownProps
})

export default connect(mapStateToProps, {
  sendLoginRequest: login,
  sendCreateAccountRequest: createAccount,
})(FormDialog);