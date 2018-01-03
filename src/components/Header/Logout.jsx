import React from 'react';
import { withRouter } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import LogOutIcon from 'material-ui/svg-icons/action/power-settings-new';

import strings from 'lang';
import styled from 'styled-components';
import constants from 'components/constants';

const LogoutButton = styled.a`
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
  constructor() {
    super();
    this.state = {};
    this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  handleClickLogout(event) {
    const that = this;
    event.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('account_user');
    localStorage.removeItem('account_hotspot');
    window.location.href = '/';
  }

  render() {
    return (
      <LogoutButton rel="no-opener no-referrer" onClick={e => this.handleClickLogout(e)}>
        <LogOutIcon />
        <span>{strings.app_logout}</span>
      </LogoutButton>
    );
  }
}

export default withRouter(Logout);
