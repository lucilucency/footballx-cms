import React from 'react';
import { withRouter } from 'react-router-dom';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import strings from '../../lang';
import { eraseCookie } from '../../utils';
import { LinkStyled } from './Styled';

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
