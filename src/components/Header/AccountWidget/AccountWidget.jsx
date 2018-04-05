import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import strings from 'lang';
import Error from 'components/Error';
import FlatButton from 'material-ui/FlatButton';
import UserIcon from 'material-ui/svg-icons/action/verified-user';
import Spinner from 'components/Spinner';

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
  const { loading, error, user, style = {} } = propsVar;
  return (
    <div style={style}>
      {error && <Error />}
      {!error && !loading && user
        ? <LoggedIn user={user} />
        : <Link to="/login">
          <FlatButton
            label={strings.app_login}
            hoverColor="transparent"
          />
        </Link>
      }
    </div>
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


class RequestLayer extends React.Component {
  componentDidMount() {

  }

  componentWillUpdate() {

  }

  render() {
    return <AccountWidget {...this.props} />;
  }
}

export default connect(mapStateToProps, null)(RequestLayer);
