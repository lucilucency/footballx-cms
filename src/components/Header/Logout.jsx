import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import ui from 'components/constants';
import strings from '../../lang';
import { eraseCookie } from '../../utils';

const LinkStyled = styled.a`
  font-size: ${ui.fontSizeNormal};
  font-weight: ${ui.fontWeightLight};
  color: ${ui.textColorPrimary} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;

  & svg {
    margin-right: 5px;

    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

class Logout extends React.Component {
  handleClickLogout = (event) => {
    event.preventDefault();
    eraseCookie('access_token');
    eraseCookie('user_id');
    eraseCookie('user_data');
    console.warn('Cleared cookie');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  render() {
    return (
      <LinkStyled
        onClick={e => this.handleClickLogout(e)}
        rel="noopener noreferrer"
      >
        <LogOutButton />
        <span>
          {strings.app_logout}
        </span>
      </LinkStyled>
    );
  }
}

export default withRouter(Logout);
