import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = ({
  isLoading
}) => (
    <Dialog
      open={isLoading}
      contentStyle={{width: 128}}
      modal={false} // when the api is up and working this should be true
    >
      <CircularProgress size={80} thickness={5} />
    </Dialog>)

export default connect((state) => {
  console.log(state.login.isLoading)
  return {
    isLoading: state.login.isLoading
  }
})(Loading)