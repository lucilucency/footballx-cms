import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import strings from 'lang';
import FlatButton from 'material-ui/FlatButton';
import UserIcon from 'material-ui/svg-icons/action/verified-user';
import Spinner from 'components/Spinner';
import constants from 'components/constants';

const LoggedIn = (propsVar) => {
  const { user } = propsVar;
  if (!user.id) {
    return <Spinner color="#fff" size={0.5} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Link to={`/user/${user.id}`}>
        <FlatButton
          icon={<UserIcon />}
          label={user.fullname || strings.header_my_account}
          // labelPosition="before"
          hoverColor="transparent"
          style={{ fontSize: constants.fontSizeMedium, fontWeight: constants.fontWeightLight, color: constants.colorMutedLight }}
        />
      </Link>
    </div>
  );
};

export default connect()(LoggedIn);
