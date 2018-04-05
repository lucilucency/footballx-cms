import React from 'react';
import { withRouter } from 'react-router-dom';
import LogOutIcon from 'material-ui/svg-icons/action/power-settings-new';
import { FlatButton } from 'material-ui';
import strings from 'lang';
import styled from 'styled-components';
import constants from 'components/constants';

const LogoutButton = styled(FlatButton)`
  font-size: ${constants.fontSizeMedium} !important;
  font-weight: ${constants.fontWeightLight} !important;
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 5px;

    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

class Logout extends React.Component {
  static handleClickLogout(event) {
    event.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('account_user');
    localStorage.removeItem('account_hotspot');
    window.location.href = '/';
  }

  constructor() {
    super();
    this.state = {};
    // this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  render() {
    return (<LogoutButton
      label={strings.app_logout}
      hoverColor="transparent"
      icon={<LogOutIcon />}
      onClick={e => Logout.handleClickLogout(e)}
    />);
  }
}

export default withRouter(Logout);
