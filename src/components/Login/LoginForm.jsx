import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { login, getUserMetadata, getHUserHotspot } from 'actions';
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
    that.props.huserLogin(this.state.username, this.state.password).then((o, e) => {
      if (!e) {
        if (o.payload.data) {
          const data = o.payload.data;
          data.user_type = data.type;
          delete data.type;
          if (data.user_type === 1) {
            that.setState({
              loginError: true,
              message: 'Permission denied!',
            });
          } else {
            if (data.user_type === 1) {
              data.user = data.cuser;
            } else if (data.user_type === 2) {
              data.user = data.huser;
            } else if (data.user_type === 3) {
              data.user = data.guser;
            }

            delete data.huser;
            delete data.guser;
            delete data.cuser;

            data.user.user_type = data.user_type;

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('account_user', JSON.stringify(data.user));

            if (data.user_type === 2) {
              that.props.getHUserHotspot(data.user.id).then((h) => {
                localStorage.setItem('account_hotspot', JSON.stringify(h.payload));
                that.props.dispatchUserMetadata({ access_token: data.access_token, account_hotspot: h.payload, account_user: data.user });
                that.props.history.push('');
              });
            } else {
              that.props.history.push('');
            }
          }
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
            errorText={this.state.message}
            onKeyDown={this.handleTextFieldKeyDown}
          />
          <br />
          <FlatButton label={strings.home_login} primary onClick={event => this.handleClick(event)} />
        </form>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  huserLogin: (username, password) => dispatch(login(username, password)),
  dispatchUserMetadata: params => dispatch(getUserMetadata(params)),
  getHUserHotspot: id => dispatch(getHUserHotspot(id)),
});

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
