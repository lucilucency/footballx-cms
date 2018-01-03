import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { huserLogin, getUserMetadata, getHUserHotspot } from 'actions';
import strings from 'lang';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loginError: false,
      message: '',
    };
    this.doLogin = this.doLogin.bind(this);
  }

  componentWillMount() {

  }

  handleClick(event) {
    event.preventDefault();
    this.doLogin();
  }

  doLogin() {
    const that = this;
    that.props.huserLogin(this.state.username, this.state.password).then((o, e) => {
      if (!e) {
        if (o.payload.data) {
          const data = o.payload.data;
          data.user.user_type = 2; // huser
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('account_user', JSON.stringify(data.user));
          that.props.getHUserHotspot(data.user.id).then((o) => {
            localStorage.setItem('account_hotspot', JSON.stringify(o.payload));
            that.props.getHUserMetadata({ access_token: data.access_token, account_hotspot: o.payload, account_user: data.user });
          });
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
            onKeyDown={this.handleTextFieldKeyDown.bind(this)}
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({ password: newValue })}
            errorText={this.state.message}
            onKeyDown={this.handleTextFieldKeyDown.bind(this)}
          />
          <br />
          <FlatButton label={strings.home_login} primary onClick={event => this.handleClick(event)} />
        </form>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  huserLogin: (username, password) => dispatch(huserLogin(username, password)),
  getHUserMetadata: params => dispatch(getUserMetadata(params)),
  getHUserHotspot: id => dispatch(getHUserHotspot(id)),
});

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
