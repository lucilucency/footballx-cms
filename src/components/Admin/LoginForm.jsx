import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { cuserLogin, getUserMetadata } from 'actions';
import strings from 'lang';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loginError: false,
      message: '',
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
    that.props.cuserLogin(this.state.username, this.state.password).then((o, e) => {
      if (!e) {
        if (o.payload.data) {
          const data = o.payload.data;
          data.user.user_type = 1; // cuser
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('account_user', JSON.stringify(data.user));
          that.props.getUserMetadata({ access_token: data.access_token, account_user: data.user });
          that.props.history.push('');
        } else {
          that.setState({
            loginError: true,
            message: o.payload.message,
          });
        }
      }
    });
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
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) => this.setState({ username: newValue, message: '' })}
            onKeyDown={this.handleTextFieldKeyDown}
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({ password: newValue })}
            onKeyDown={this.handleTextFieldKeyDown}
            errorText={this.state.message}
          />
          <br />
          <FlatButton label={strings.home_login} primary onClick={event => this.handleClick(event)} />
        </form>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  cuserLogin: (username, password) => dispatch(cuserLogin(username, password)),
  getUserMetadata: params => dispatch(getUserMetadata(params)),
});

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
