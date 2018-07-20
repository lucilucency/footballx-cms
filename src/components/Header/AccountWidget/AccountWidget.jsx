import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import strings from 'lang';
import Error from 'components/Error';
import FlatButton from 'material-ui/FlatButton';
import UserIcon from 'material-ui/svg-icons/action/verified-user';
import Spinner from 'components/Spinner';
import { LinkStyled } from '../Styled';

const LoggedIn = (propsVar) => {
  const { user } = propsVar;
  if (!user.user_id) {
    return <Spinner color="#fff" size={0.5} />;
  }
  return (<Link to={`/user/${user.user_id}`}>
    <FlatButton
      label={user.fullname || user.name || strings.header_my_account}
      hoverColor="transparent"
      icon={<UserIcon />}
      fullWidth
    />
  </Link>);
};


const AccountWidget = (propsVar) => {
  const { loading, error, user } = propsVar;
  return error ? <Error /> :
    !loading && user ? <LoggedIn user={user} /> : (
      <LinkStyled
        onClick={() => {
          propsVar.history.push('/login');
        }}
      >
        <span>{strings.app_login}</span>
      </LinkStyled>
    );
};

const mapStateToProps = (state) => {
  const { error, loading, data } = state.app.metadata;
  return {
    loading,
    error,
    user: data.user,
  };
};


// const mapDispatchToProps = dispatch => ({
  // getPlayer: playerId => dispatch(getPlayer(playerId)),
// });


const RequestLayer = propsVar => <AccountWidget {...propsVar} />;

export default connect(mapStateToProps, null)(withRouter(RequestLayer));
