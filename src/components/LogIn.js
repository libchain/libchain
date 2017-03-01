import React, { Component }from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';

import request from 'superagent';

class LogInForm extends Component {
  errorMessages = {
    passwordError: "Please no special characters or spaces",
    emailError: "Please provide a valid email address"
  } 

  state = {
    canSubmit: false,
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

  submitForm = (data) => {
    alert(JSON.stringify(data, null, 4));
    this.props.submitForm(data)
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  } 

  constructor() {
    super();


    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.notifyFormError = this.notifyFormError.bind(this)
  }
  
  render() {
    return (
      <Form 
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={this.submitForm}
        onInvalidSubmit={this.notifyFormError}
      >
        <FormsyText
          name="email"
          validations="isEmail"
          validationError={this.errorMessages.emailError}
          errorStyle={{float: 'left'}}
          required
          floatingLabelText="Email"
          fullWidth={true}
        />
        <FormsyText
          name="password"
          validations="isAlphanumeric"
          validationError={this.errorMessages.passwordError}
          errorStyle={{float: 'left'}}
          required
          floatingLabelText="Password"
          type="password"
          fullWidth={true}
        />
      </Form>
      )
  }
}

class LogIn extends Component {
  state = {
    dialogOpen: false,
    loginErrors: null,
    waiting: false
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

  /**
    * Sends log in request to server
    */
  handleSubmit = (data) => {
    this.setState({ waiting: true, dialogOpen: false })
    request
      .post('/auth/login')
      .send(data.email)
      .send(data.password)
      .then((res, err) => {
        if (res.status === 200 && res.body.ok) {
          this.setState({
            waiting: false
          })
          /* set everything to logged in */
        } else {
          this.setState({ waiting: false, dialogOpen: true })
          this.setState({ loginErrors: res.body.errors })
        }
      })
      .catch(err => console.log(err))

  }

  constructor() {
    super();
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  render() {
    if (this.state.waiting) {
      return <Dialog
                open={!this.state.dialogOpen && this.state.waiting}
                contentStyle={{width: 128}}
                modal={false} // when the api is up and working this should be true
              >
                <CircularProgress size={80} thickness={5} />
              </Dialog>
    }

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Log In"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <FlatButton 
          label="Log in" 
          style={{paddingTop: 5, color: 'white'}} 
          onTouchTap={this.handleOpen}
        />
        <Dialog
          title="Log In"
          actions={actions}
          contentStyle={{width: '40%'}}
          titleStyle={{fontWeight: 100, padding: '16px 24px'}}
          open={this.state.dialogOpen && !this.state.waiting}
          modal={true}
        >
          <LogInForm submitForm={this.handleSubmit} errors={this.state.loginErrors}/>
        </Dialog>
      </div>
    )
  }
}

export default LogIn;