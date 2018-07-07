import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { auth, getLocalMetadata, getHUserHotspot } from 'actions';
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

  componentWillReceiveProps(props) {
    if ((!this.props.user || !this.props.user.id) && props.user && props.user.user_id) {
      const userType = props.user.user_type;
      if (userType === 2) {
        props.getHUserHotspot(props.user.user_id).then((h) => {
          localStorage.setItem('account_hotspot', JSON.stringify(h.payload));
          // TODO update metadata here (user hotspot info)
          props.history.push('/');
        });
      } else if (userType === 3 || userType === 1) {
        // TODO update metadata here
        props.history.push('/');
      } else {
        props.history.push('/');
      }
    }
  }

  handleClick(event) {
    event.preventDefault();
    this.doLogin();
  }

  doLogin() {
    const that = this;
    that.props.login(this.state.username, this.state.password);
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

const mapStateToProps = state => ({
  user: state.app.metadata.user,
});

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(auth(username, password)),
  dispatchUserMetadata: params => dispatch(getLocalMetadata(params)),
  getHUserHotspot: id => dispatch(getHUserHotspot(id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
