import React, { Component }from 'react';

import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';

class EmailPassForm extends Component {
  errorMessages = {
    passwordError: "Please no special characters or spaces",
    emailError: "Please provide a valid email address"
  } 

  submitForm = (data) => {
    this.props.submitForm(data)
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  } 

  setRef = (referee) => {
    this.props.setFormRef(referee)
  }

  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this)
    this.notifyFormError = this.notifyFormError.bind(this)
  }

  render() {
    return (
      <Form 
        onValid={this.props.enableButton}
        onInvalid={this.props.disableButton}
        onValidSubmit={this.submitForm}
        onInvalidSubmit={this.notifyFormError}
        ref={(form) => this.setRef(form)}
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

export default EmailPassForm;