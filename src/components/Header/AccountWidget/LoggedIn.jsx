import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import strings from 'lang';
import FlatButton from 'material-ui/FlatButton';
import UserIcon from 'material-ui/svg-icons/action/verified-user';
import Spinner from 'components/Spinner';
// import constants from 'components/constants';
import styled from 'styled-components';

const StyledFlatButton = styled(FlatButton)`
 min-width: 30px !important;
 & > div > span {
   display: inline-block;
   max-width: 150px;
   overflow: hidden;
   text-overflow: ellipsis;
   text-transform: none !important;
   white-space: nowrap;
   font-size: 16px !important;
   padding-right: 10px !important;
   padding-left: 0 !important;
 }
`;


const LoggedIn = (propsVar) => {
  const { user } = propsVar;
  if (!user.user_id) {
    return <Spinner color="#fff" size={0.5} />;
  }
  return (
    <div>
      <Link to={`/user/${user.user_id}`}>
        <StyledFlatButton
          label={user.fullname || user.name || strings.header_my_account}
          hoverColor="transparent"
          icon={<UserIcon />}
        />
      </Link>
    </div>
  );
};

export default connect()(LoggedIn);
