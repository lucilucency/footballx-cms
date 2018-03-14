import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import strings from 'lang';

class SettingsForm extends React.Component {
  constructor() {
    super();
    this.state = {
      guest_number: Number(localStorage.getItem('guest_number')) || 0,
    };
    this.doLogin = this.doLogin.bind(this);
    this.handleTextFieldKeyDown = this.handleTextFieldKeyDown.bind(this);
  }

  componentWillMount() {

  }

  handleClick(event) {
    event.preventDefault();
    this.doLogin();
  }

  doLogin() {
    const that = this;
    localStorage.setItem('guest_number', that.state.guest_number);
    // const answer = confirm(`Settings Guest Number: ${that.state.guest_number}`);
    // if (answer) { that.props.history.push(''); }
    that.props.history.push('');
  }

  handleTextFieldKeyDown = (event) => {
    const that = this;
    switch (event.key) {
      case 'Enter':
        that.doLogin();
        break;
      case 'Escape':
        // etc...
        break;
      default: break;
    }
  };

  render() {
    return (
      <form>
        <TextField
          value={this.state.guest_number}
          type="number"
          hintText="Enter your guest number"
          floatingLabelText="Guest No."
          onChange={(event, newValue) => this.setState({ guest_number: newValue })}
          onKeyDown={this.handleTextFieldKeyDown}
        />
        <br />
        <FlatButton label={strings.form_general_submit} primary onClick={event => this.handleClick(event)} />
      </form>
    );
  }
}

export default withRouter(connect(null, null)(SettingsForm));
